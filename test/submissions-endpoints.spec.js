const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeSubmissionsArray,  makeMaliciousSubmission  } = require('./submissions.fixtures')
const { makeAdminsArray } = require('./admins.fixtures')



describe.only('Submissions Endpoints', function(){
let db

before('make knex instance', () => {

    db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
      })
      app.set('db', db)

})

after('disconnect from db', () => db.destroy())

before('clean the table', () => db.raw('TRUNCATE admins, submissions RESTART IDENTITY CASCADE'))

afterEach('cleanup',() => db.raw('TRUNCATE admins, submissions RESTART IDENTITY CASCADE'))

describe(`GET /api/submissions`, () =>{
context(`Given no submissions`, () =>{
    it(`returns status code 200 and an empty list`, () =>{
        return supertest(app)
            .get('/api/submissions')
            .expect(200, [])
    })
})

context('Given there are submissions in the database', () =>{
const testSubmissions = makeSubmissionsArray();
const testAdmins = makeAdminsArray()
;
    beforeEach(`insert submissions`, () =>{
        return db
            .into('admins')
            .insert(testAdmins)
            .then(() =>{
                return db
                    .into('submissions')
                    .insert(testSubmissions)
            })
    })
    it(`responds with 200 and all of the submissions`, () =>{
        return supertest(app)
            .get(`/api/submissions`)
            .expect(200, testSubmissions)
    })

})
    context(`Given an xss attack submission`, () =>{
        const testAdmins = makeAdminsArray();
        const { maliciousSubmission, expectedSubmission } = makeMaliciousSubmission();

        beforeEach(`insert malicious submission`, () =>{
            return db
                .into('admins')
                .insert(testAdmins)
                .then(() =>{
                    return db
                        .into('submissions')
                        .insert(maliciousSubmission)
                        
                })
        })

        it(`removes xss attack`, () =>{
               return supertest(app)
                   .get(`/api/submissions`)
                   .expect(res =>{
                       expect(res.body[0].title).to.eql(expectedSubmission.title)
                       expect(res.body[0].description).to.eql(expectedSubmission.description) 
                   })
    }) 
    })
    
    
})

describe(`GET /api/submissions/:submission_id`, () => {
    context(`Given no submissions`, () => {
      it(`responds with 404`, () => {
        const submissionId = 1234567
        return supertest(app)
          .get(`/api/submissions/${submissionId}`)
          .expect(404, { error: { message: `Submission doesn't exist` } })
      })
    })

    context('Given there are submissions in the database', () => {
      const testAdmins = makeAdminsArray();
      const testSubmissions = makeSubmissionsArray()

      beforeEach('insert submissions', () => {
        return db
          .into('admins')
          .insert(testAdmins)
          .then(() => {
            return db
              .into('submissions')
              .insert(testSubmissions)
          })
      })

      it('responds with 200 and the specified submission', () => {
        const submissionId = 2
        const expectedSubmission = testSubmissions[submissionId - 1]
        return supertest(app)
          .get(`/api/submissions/${submissionId}`)
          .expect(200, expectedSubmission)
      })
    })

    context(`Given an XSS attack submission`, () => {
      const testAdmins = makeAdminsArray();
      const { maliciousSubmission, expectedSubmission } = makeMaliciousSubmission()

      beforeEach('insert malicious submission', () => {
        return db
          .into('admins')
          .insert(testAdmins)
          .then(() => {
            return db
              .into('submissions')
              .insert([ maliciousSubmission ])
          })
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/submissions/${maliciousSubmission.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedSubmission.title)
            expect(res.body.description).to.eql(expectedSubmission.description)
          })
      })
    })
  })
  describe(`POST /api/submissions`, () => {
    const testAdmins = makeAdminsArray();
    beforeEach('insert malicious submission', () => {
      return db
        .into('admins')
        .insert(testAdmins)
    })

    it(`creates a submission, responding with 201 and the new submission`, () => {
      const newSubmission =  {
        fullname: "Avery Poll",
        phonenumber: "1234567890",
        email: "avery@email.com",
        interestedposition: "Robotics instructor",
        resumelink: "http://avery.com"
    }
      return supertest(app)
        .post('/api/submissions')
        .send(newSubmission)
        .expect(201)
        .expect(res => {
          expect(res.body.fullname).to.eql(newSubmission.fullname)
         //user_id
          expect(res.body.phonenumber).to.deep.eql(newSubmission.phonenumber)
          expect(res.body.email).to.eql(newSubmission.email)
          expect(res.body.interestedposition).to.eql(newSubmission.interestedposition)
          expect(res.body.resumelink).to.eql(newSubmission.resumelink)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/submissions/${res.body.id}`)
          //const expected = new Intl.DateTimeFormat('en-US').format(new Date())
          //const actual = new Intl.DateTimeFormat('en-US').format(new Date(res.body.date_published))
          //expect(actual).to.eql(expected)
        })
        .then(res =>
          supertest(app)
            .get(`/api/submissions/${res.body.id}`)
            .expect(res.body)
        )
    })

    const requiredFields = ['fullname', 'phonenumber', 'email', 'interestedposition', 'resumelink']

    requiredFields.forEach(field => {
        const newSubmission = {
            fullname: "Avery Poll",
            phonenumber: "1234567890",
            email: "avery@email.com",
            interestedposition: "Robotics instructor",
            resumelink: "http://avery.com"
          }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newSubmission[field]

        return supertest(app)
          .post('/api/submissions')
          .send(newSubmission)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })

    it('removes XSS attack content from response', () => {
      const { maliciousSubmission, expectedSubmission } = makeMaliciousSubmission()
      return supertest(app)
        .post(`/api/submissions`)
        .send(maliciousSubmission)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(expectedSubmission.title)
          expect(res.body.content).to.eql(expectedSubmission.content)
        })
    })
  })
  describe(`DELETE /api/submissions/:submission_id`, () =>{
      context(`Given there are no submissions in the database`, () =>{
          const submissionId = 1234567;
          it(`responds with 404`, () =>{
              return supertest(app)
                .get(`/api/submissions/${submissionId}`)
                .expect(404, { error: { message: `Submission doesn't exist` } })
          })
      })
      context(`Given there are submissions in the database`, () =>{
          const testSubmissions = makeSubmissionsArray();
          const testAdmins = makeAdminsArray();
          const submissionId = 1;

          beforeEach(`insert submissions`, () =>{
              return db
                .into('admins')
                .insert(testAdmins)
                .then(() =>{
                    return db
                    .into('submissions')
                    .insert(testSubmissions)
                })
                
          })
          it(`deletes the submission with the specified id`, () =>{
              const submissionId = 1;
              const expectedsubmissions = () => testsubmissions.filter( submission => submission.id !== submissionId )
              supertest(app)
                .delete(`/api/submissions/${submissionId}`)
                .expect(404)
                .then(res =>{
                     supertest(app)
                        .get(`/api/submissions`)
                        .expect(expectedsubmissions)
                })

          })
      })
  })

describe(`POST /api/admins/login`, () =>{
  context(`Given there are no admins in the database`, () =>{
    it(`responds with an error`, () =>{
      const adminCredentials = {
        username: 'Bob Sample',
        password: 'Samplepw'
      }
      return supertest(app)
        .post(`/api/admins/login`)
        .send(adminCredentials)
        .expect(400)
    })
  context(`Given there are admins in the database`, ()  =>{
    context(`Given invalid credentials are submitted`, () =>{
      it(`responds with 400 and an error message`, () =>{
        const adminCredentials = {
          fullname:'Bob Sample',
          username: 'bobsample',
          password: 'Samplepw'
        }
        const invalidPasswordCredentials = {
          username: 'bobsample',
          password: 'WrongSamplepw'
        }
        const invalidUsernameCredentials = {
          username: 'nonexistentusername',
          password: 'WrongSamplepw'
        }
        return supertest(app)
          .post(`/api/admins`)
          .send(adminCredentials)
          .expect(201)
          .then(res => 
            supertest(app)
            .post(`/api/admins/login`)
            .send(invalidPasswordCredentials)
            .expect(400, 'Not Allowed')) 
            .then(res => 
              supertest(app)
            .post(`/api/admins/login`)
            .send(invalidUsernameCredentials)
            .expect(400, 'Cannot find user'))
      })
    })
  context(`Given valid credentials are submitted`, () =>{
    it(`responds with 200 and 'Success`, () =>{
      const adminCredentials = {
        fullname:'Bob Sample',
        username: 'bobsample',
        password: 'Samplepw'
      }
     
      return supertest(app)
        .post(`/api/admins`)
        .send(adminCredentials)
        .expect(201)
        .then(res => 
          supertest(app)
          .post(`/api/admins/login`)
          .send(adminCredentials)
          .expect(200, 'Success')) 
    })
    
  })  
  })  
  })

})
})