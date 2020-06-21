const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/User")
const User= mongoose.model("users")

router.get('/login', (req,res)=>{
    res.render('/login')
})

router.get('/register', (req,res)=>{
    res.render('/register')
})

router.post('/register', (req,res)=>{
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
        //res.render("usuarios/register", {erros: erros})
        res.render("/register", {erros: erros})

    }else{

    }
})

module.exports = router