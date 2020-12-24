const express = require('express')
const xss = require('xss')
const path = require('path')
const AdminsService = require('./admins-service')
const bcrypt = require('bcrypt')

const adminsRouter = express.Router()
const jsonParser = express.json()

const serializeAdmin = admin => ({
    id: admin.id,
    fullname: xss(admin.fullname),
    username: xss(admin.username),
    password: xss(admin.password),
    date_created: admin.date_created
})

adminsRouter
    .route('/')
    .get((req, res, next) =>{
        const knexInstance = req.app.get('db')
        AdminsService.getAllAdmins(knexInstance)
            .then(admins => {
                res.json(admins.map(serializeAdmin))
            })
            .catch(next)
           
    })
    .post(jsonParser, async (req, res, next) =>{

        try{

      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
        
        const knexInstance = req.app.get('db')
        const { fullname, username } = req.body;
        const password = hashedPassword;
        const newAdmin = { fullname, username, password }

        for(const [key, value] of Object.entries(newAdmin)){
            if(value == null){
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })
            }
        }

        newAdmin.fullname = fullname;
        newAdmin.username = username;
        newAdmin.password = password;

        AdminsService.insertAdmin(knexInstance, newAdmin)
            .then(admin =>{
                res 
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${admin.id}`))
                    .json(serializeAdmin(admin))
            })

        }
        catch(error){
  
            res.status(400).send(error.message) 
         
       }
    })
    
    
    

    adminsRouter
    .route(`/login`)
    .post(jsonParser, async (req, res, next) => {

      const knexInstance = req.app.get('db')
      AdminsService.getAllAdmins(knexInstance)
      .then(admins => admins.find(admin => admin.username == req.body.username))
      .then(async admin => {if(admin == null) {
         res.status(400).send(`Cannot find user`)
      }
      try{
       if( await bcrypt.compare(req.body.password, admin.password)){
         res.send('Success')
       }
       else{
         res.status(400).send('Not Allowed')
       }
      }
      catch{
        res.status(500).send()
      }})

  })
    
 
    adminsRouter
    .route('/:admin_id')
    .all((req, res, next) =>{
        const knexInstance = req.app.get('db');
        AdminsService.getById(knexInstance, req.params.admin_id)
        .then(admin => {
            if (!admin) {
              return res.status(404).json({
                error: { message: `Admin doesn't exist` }
              })
            }
            res.admin = admin
            next()
          })
          .catch(next)
      })
      .get((req, res, next) => {
        res.json(serializeAdmin(res.admin))
      })
      .delete((req, res, next) => {
        AdminsService.deleteAdmin(
          req.app.get('db'),
          req.params.admin_id
        )
          .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
      })
      .patch(jsonParser, (req, res, next) => {
        const { fullname, username, password } = req.body
        const adminToUpdate = { fullname, username, password }
    
        const numberOfValues = Object.values(adminToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
          return res.status(400).json({
            error: {
              message: `Request body must contain either 'fullname', 'username', or 'password'`
            }
            
          })
    
        AdminsService.updateAdmin(
          req.app.get('db'),
          req.params.admin_id,
          adminToUpdate
        )
          .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
      })

    


    module.exports = adminsRouter;