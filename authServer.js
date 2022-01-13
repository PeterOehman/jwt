const express = require('express')
const app = express()
require('dotenv').config()

const jwt = require('jsonwebtoken')

app.use(express.json())

let refreshTokens = []

//REMOVES REFRESH TOKEN
app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

//VERIFIES THE REFRESH TOKEN AND CREATES NEW ACCESS TOKEN
app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (!refreshToken) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken })
  })
})

//CREATES AN ACCESS TOKEN AND A REFRESH TOKEN, ACCESS TOKEN EXPIRES, REFRESH TOKEN IS USED TO CREATE NEW ONES
app.post('/login', (req, res) => {
   //authenticate user
  const username = req.body.username
  const user = { name: username }
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)
  res.json({ accessToken, refreshToken})
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
}

function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)
  return refreshToken
}

app.listen(4000)
