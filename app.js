require('dotenv').config()
const express = require('express')
const path = require('node:path')
var cors = require('cors')
const app = express()
const mongoose = require('mongoose');
const url = process.env.MONGO_URL;
const { ERROR } = require('./utils/httpStatusText')
const couresRouter = require('./routes/courses.route')
const usersRouter = require('./routes/users.route');

mongoose.connect(url).then(() => {
  console.log('connected sucsses')
}).catch((error) => {
  console.log(error)
})

app.use('/uploads' , express.static(path.join(__dirname,'uploads')))

// to solve proplem Cors police 
app.use(cors())

app.use(express.json())// body للتعامل مع ال 



//Routes
app.use('/api/courses', couresRouter)
app.use('/api/users', usersRouter)



// Global middleware handel route 
app.all('*', (req, res, next) => {
  return res.status(404).json({ status: ERROR, data: { Course: "page Not found" } })
})

// Global middleware handel Eroord
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ status: error.statusText, message: error.message, code : error.status})
})



app.listen(process.env.PORT || 3000, () => {
  console.log(`start listening on port 3000`)
})