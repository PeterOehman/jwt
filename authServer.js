const express = require('express')
const app = express()
require('dotenv').config()

const jwt = require('jsonwebtoken')

app.use(express.json())

app.post('/token', (req, res) => {
  
})

app.post('/login', (req, res) => {
   //authenticate user
  const username = req.body.username
  const user = { name: username }
  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  res.json({ accessToken, refreshToken})
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

app.listen(4000)
