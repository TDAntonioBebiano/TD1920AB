//var app = require('express')();
const express= require('express')
//var router = express()
const Project=require('./../models/project')
const router=express.Router()


router.get('/new',(req,res)=>{
    res.render('projects/new', {project: new Project()})
})

router.get('/edit/:id', async (req,res)=>{
    const project = await Project.findById(req.params.id)
    res.render('projects/edit', {project: project})
})

router.get('/edit/:id/wicked', async (req,res)=>{
    const project = await Project.findById(req.params.id)
    res.render('projects/wicked',{project: project})
})

router.get('/edit/:id/fishbone', async (req,res)=>{
    const project = await Project.findById(req.params.id)
    res.render('projects/fishbone',{project: project})
})

router.get('/edit/:id/STM', async (req,res)=>{
    const project = await Project.findById(req.params.id)
    res.render('projects/STM',{project: project})
})

router.get('/edit/:id/stakeholders', async (req,res)=>{
    const project = await Project.findById(req.params.id)
    res.render('projects/stakeholders',{project: project})
})

router.get('/edit/:id/futurevision', async (req,res)=>{
    const project = await Project.findById(req.params.id)
    res.render('projects/futurevision',{project: project})
})

router.get('/edit/:id/diagram', async (req,res)=>{
    const project = await Project.findById(req.params.id)
    res.render('projects/diagram',{project: project})
})

router.get('/:slug', async (req,res)=>{
    const project = await Project.findOne({slug:req.params.slug})
    if (project == null ){
     res.redirect('/projects')
    }
    res.render("projects/show", {project: project})
})

router.post('/', async (req,res,next)=>{
    req.project= new Project()

    next()
}, saveAndRedirect('projects'))

router.put('/:id', async (req,res,next)=>{
    req.project= await Project.findById(req.params.id)

    next()
}, saveAndRedirect('edit'))



router.delete('/:id', async (req,res)=>{
    await Project.findByIdAndDelete(req.params.id)
    res.redirect('/projects')
})


router.get('/wicked',(req,res)=>{
    res.render('projects/wicked')
})


function saveAndRedirect(path){
    return async (req,res)=>{
        let project=req.project
       
           project.title=req.body.title
            project.description=req.body.description
            project.markdown=req.body.markdown
      
        try{
            await project.save()
            res.redirect(`/projects/${project.slug}`)
        }catch(e){
            res.render(`projects/${path}`, {project: project})
        }   
    }
}

module.exports=router