const express = require('express')
const app = express()
require('dotenv').config()

const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [
  {
    username: 'Peter',
    title: 'Post 1'
  },
  {
    username: 'Peter2',
    title: 'Post 2'
  }
]

//VERIFIES THE ACCESSTOKEN AND RETURNS POSTS RELATED TO USER
app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name))
})

function authenticateToken (req, res, next) {
  //in the authorization header there is an authorizaion piece with out token
  const authHeader = req.headers['authorization']
  //the header comes back in the form Bearer TOKEN where the token is out token, so here we are checking if the header exists and if it does, get the token
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.listen(3000)
