const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeAdminsArray } = require('./admins.fixtures')
const bcrypt = require('bcrypt')



describe('Admins Endpoints', function() {
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

describe(`GET /api/admins`, () =>{
context(`Given no admins`, () =>{
   
    it('responds with status 200 and an empty list', () =>{
        
        return supertest(app)
        .get('/api/admins')
        .expect(200, [])
    })
   
})

context('Given there are admins in the database', () =>{
    const testAdmins = makeAdminsArray();
    

    beforeEach('insert admins', () => {
        return db
          .into('admins')
          .insert(testAdmins) 
      })
      it('responds with 200 and all of the admins', () => {
        return supertest(app)
          .get('/api/admins')
          .expect(200, testAdmins)
      })

      //create test for xss attack
})

})

describe(`GET /api/admins/:admin_id`, () =>{
    context(`Given no admins`, () =>{
        it(`responds with 404 an error message`, () =>{
        const adminId = 1234567;
        return supertest(app)
            .get(`/api/admins/${adminId}`)
            .expect(404, { error: { message: `Admin doesn't exist` } })
        })
    } )

    context(`Given there are admins in the database`, () =>{
        const testAdmins = makeAdminsArray();

        beforeEach('insert admins', () => {
            return db
              .into('admins')
              .insert(testAdmins) 
          })

        it(`responds with 200 and the specified admin`, () =>{
            const adminId = 1;
            const expectedAdmin = testAdmins[adminId - 1]
            return supertest(app)
                .get(`/api/admins/${adminId}`)
                .expect(200, expectedAdmin)
        })

        //Create test for xss attack admin


    })

})

describe(`POST /api/admins`, () =>{
    
    it(`creates an admin, responding with 201 and the admin`, () =>{
        const newAdmin = {
            fullname: "John Green Pepper",
            username: "jpepper003",
            password: "ilikepepper"
        }
        return supertest(app)
            .post(`/api/admins`)
            .send(newAdmin)
            .expect(201)
            .expect(res =>{
                expect(res.body.fullname).to.eql(newAdmin.fullname)
                expect(res.body.username).to.eql(newAdmin.username)
                expect(bcrypt.compare(newAdmin.password, res.body.password)).to.eql('true')
                expect(res.body).to.have.property('id')
                expect(res.headers.location).to.deep.eql(`/api/admins/${res.body.id}`)
                const expected = new Intl.DateTimeFormat('en-US').format(new Date())
                const actual = new Intl.DateTimeFormat('en-US').format(new Date(res.body.date_created))
                expect(actual).to.eql(expected)
                })
                .then(res =>{
                    supertest(app)
                        .get(`/api/admins/${res.body.id}`)
                        .expect(res.body)
                })

            

    })
    const requiredFields = ['fullname', 'username', 'password']

    requiredFields.forEach(field => {
        const newAdmin = {
            fullname: "John Green Pepper",
            username: "jpepper003",
            password: "ilikepepper"
        }

        it(`responds with an error message when the ${field} is missing`, () => {
            delete newAdmin[field]

            return supertest(app)
                .post('/api/admins')
                .send(newAdmin)
                .expect(400, {
                    error: { message: `Missing '${field}' in request body` }
                  } )
        })
        
      })
})

describe(`DELETE /api/admins/:admin_id`, () => {
    context(`Given no admins`, () =>{
        it(`responds with 404`, () => {
            const adminId = 1234567
            return supertest(app)
              .delete(`/api/admins/${adminId}`)
              .expect(404, { error: { message: `Admin doesn't exist` } })
          })
    })
    context('Given there are admins in the database', () => {
        const testAdmins = makeAdminsArray();
        
  
        beforeEach('insert admins', () => {
          return db
            .into('admins')
            .insert(testAdmins)
            
        })
  
        it('responds with 204 and removes the admin', () => {
          const idToRemove = 1
          const expectedAdmins = testAdmins.filter(admin => admin.id !== idToRemove)
          return supertest(app)
            .delete(`/api/admins/${idToRemove}`)
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/admins`)
                .expect(expectedAdmins)
            )
        })
      })
})





})