const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
//const handlebars = require('express-handlebars')
const session = require("express-session")
const flash = require("connect-flash")
const bcrypt = require("bcryptjs")
const passport = require("passport")
require("./config/auth")(passport)
const Project = require('./models/project')
const projectRouter= require('./routes/projects')
const methodOverride= require('method-override')

//-----------------
var http = require('http').Server(app);
var io = require('socket.io')(http);
//-----------------


require("./models/User")
const Users = mongoose.model("users")

app.use(session({
    secret: "cursodenode",
    resave:true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
//--------------

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.set('view engine','ejs')
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,"public")))

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/teste", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex:true
}).then(()=>{
    console.log("conectado ao mongo")
}).catch((err)=>{
    console.log("ocorreu um erro")
})

app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/about', (req,res)=>{
    res.render('about')
})

app.get('/learn', (req,res)=>{
    res.render('learn')
})

app.get('/login', (req,res)=>{
    res.render('login')
})

app.post('/login', (req,res,next)=>{
    passport.authenticate("local",{
        successRedirect: "/projects",
        failureRedirect: "/login",
        failureFlash: true
    })(req,res,next)
})
//------------------------------
/*io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
  });*/
//------------------------------
app.get('/register', (req,res)=>{
    res.render('register')
})

app.post('/register', (req,res)=>{
    var erros=[]

    if(!req.body.nome || typeof req.body.nome==undefined || req.body.nome == null){
        erros.push({texto: "nome invalido"})
    }
    if(!req.body.email || typeof req.body.email==undefined || req.body.email == null){
        erros.push({texto: "email invalido"})
    }
    if(!req.body.senha || typeof req.body.senha==undefined || req.body.senha == null){
        erros.push({texto: "senha invalida"})
    }

    if(req.body.senha.length < 4){
        erros.push({texto:"senha muito curta"})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto:"senhas diferente"})
    }

    if(erros.length > 0){
        res.render("register", {erros: erros})
    }else{
        Users.findOne({email: req.body.email}).then((user)=>{
            if(user){
                req.flash("error_msg","já existe uma conta")
                res.redirect("/register")
            }else{
               const novoUser = new Users({
                   nome:req.body.nome,
                   email:req.body.email,
                   senha:req.body.senha
               }) 

               bcrypt.genSalt(10,(erro, salt)=>{
                   bcrypt.hash(novoUser.senha, salt, (erro, hash)=>{
                       if(erro){
                           req.flash("error_msg","houve um erro")
                           res.redirect("/register")
                       }

                       novoUser.senha=hash

                       novoUser.save().then(()=>{
                           req.flash("success_msg","utilizador criado!")
                           res.redirect("/login")
                       }).catch((err)=>{
                           req.flash("error_msg", "houve um erro ao criar o utilizador")
                        res.redirect("/register")
                        })

                   })
               })
            }  
        }).catch((err)=>{
            req.flash("error_msg", "houve um erro")
            res.redirect("/register")
        })
        }   

})


app.get("/projects", async (req,res)=>{
     
    const projects = await Project.find().sort({createdAt: 'desc'})
    res.render('projects', {projects: projects})
    //res.render("projects")
     //res.redirect('projects/index')
})

app.get("/logout",(req,res)=>{
    req.logout()
    req.flash("success_msg","logout efetuado com sucesso!")
    res.redirect("/")
})
//-----------------------------
//app.use(methodOverride('_method'))



app.use('/projects', projectRouter)


app.listen(3000);