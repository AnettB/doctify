const express = require('express')
require('dotenv').config();

const db = require('./db')

const app = express()

const PORT = process.env.PORT

// Create and populate the staff table
db.init()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Running!')
})

app.get('/users/:id/salary', db.getSalaryById)
app.get('/users/salary', db.getCompanySalary)

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})
