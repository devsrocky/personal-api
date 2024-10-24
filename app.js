// basic lib import
const express = require('express')
const app = new express()
const bodyParser = require("body-parser")


// route import
const router = require('./src/routes/api')

// security middleware import
const cors = require('cors')
const helmet = require('helmet')
const hpp = require('hpp')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')

// mongoose import
const mongoose = require('mongoose')


// security lib implement
app.use(cors())
app.use(helmet())
app.use(hpp())
app.use(xss())
app.use(mongoSanitize())


app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended: true}))

// cookie-parser implement
app.use(cookieParser())

// body-parser implement
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// routing rate limit implementatin
const limiter = rateLimit({windowMs: 15*60*1000, max: 3000})
app.use(limiter)

// mongoDB database connection
mongoose.connect("mongodb+srv://prodhanr:portFoLIo&&PORT1050@cluster0.cy3xqek.mongodb.net/portfolio").then((res) => {
    console.log('mongoDB connected')
}).catch((err) => {
    console.log('mongoDB connection failed')
})

// route implement
app.use('/port/v1', router)

// 404 page implement
app.use("*", (req, res) => {
    res.status(404).json({status: '404', data: 'Not Found'})
})

// export app
module.exports = app;