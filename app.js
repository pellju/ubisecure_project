const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
require('dotenv').config()

const userHandling = require('./controllers/userhandling')
const trainApi = require('./controllers/trainhandling')

mongoose.connect(process.env.mongodbAddr).then(() => console.log('Connected to mongodb'))
    .catch(e => console.log('Error: ', e))

app.use(cors())
app.use(express.json())
app.use('/api', userHandling)
app.use('/trains', trainApi)

app.get('/', (req, res) => {
    res.send('Hello world!')
})

module.exports = app