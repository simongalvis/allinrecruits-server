const express = require('express')
const xss = require('xss')
const path = require('path')
const SubmissionsService = require('./submissions-service')


const submissionsRouter = express.Router()
const jsonParser = express.json()

const serializeSubmission = submission => ({
    id: submission.id,
    fullname: xss(submission.fullname),
    phonenumber: xss(submission.phonenumber),
    email: xss(submission.email),
    resumelink: xss(submission.resumelink),
    date_created: submission.date_created
})

submissionsRouter
    .route('/')
    .get((req, res, next) =>{
        const knexInstance = req.app.get('db')
        SubmissionsService.getAllSubmissions(knexInstance)
            .then(submissions => {
                res.json(submissions.map(serializeSubmission))
            })
            .catch(next)
           
    })
    .post(jsonParser, (req, res, next) =>{
        const knexInstance = req.app.get('db')
        const { fullname, phonenumber, email, resumelink } = req.body;
        const newSubmission = { fullname, phonenumber, email, resumelink }

        for(const [key, value] of Object.entries(newSubmission)){
            if(value == null){
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })
            }
        }

        newSubmission.fullname = fullname;
        newSubmission.phonenumber = phonenumber;
        newSubmission.email = email;
        newSubmission.resumelink = resumelink;

        SubmissionsService.insertSubmission(knexInstance, newSubmission)
            .then(submission =>{
                res 
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${submission.id}`))
                    .json(serializeSubmission(submission))
            })
            .catch(next)
    })

    submissionsRouter
    .route('/:submission_id')
    .all((req, res, next) =>{
        const knexInstance = req.app.get('db');
        SubmissionsService.getById(knexInstance, req.params.submission_id)
        .then(submission => {
            if (!submission) {
              return res.status(404).json({
                error: { message: `Submission doesn't exist` }
              })
            }
            res.submission = submission
            next()
          })
          .catch(next)
      })
      .get((req, res, next) => {
        res.json(serializeSubmission(res.submission))
      })
      .delete((req, res, next) => {
        SubmissionsService.deleteSubmission(
          req.app.get('db'),
          req.params.submission_id
        )
          .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
      })
      .patch(jsonParser, (req, res, next) => {
        const { fullname, phonenumber, email, resumelink } = req.body
        const submissionToUpdate = { fullname, phonenumber, email, resumelink }
    
        const numberOfValues = Object.values(submissionToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
          return res.status(400).json({
            error: {
              message: `Request body must contain either 'fullname', 'username', or 'password'`
            }
            
          })
    
        SubmissionsService.updateSubmission(
          req.app.get('db'),
          req.params.submission_id,
          submissionToUpdate
        )
          .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
      })

    


    module.exports = submissionsRouter;