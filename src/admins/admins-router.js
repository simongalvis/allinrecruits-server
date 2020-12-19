const express = require('express')
const xss = require('xss')
const path = require('path')


const adminsRouter = express.Router()
const jsonParser = express.json()

const serializeAdmin = admin => ({
    id: admin.id,
    fullname: xss(user.fullname),
    username: xss(user.username),
    password: xss(user.password),
    date_created: user.date_created
})