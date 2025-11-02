const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body
  if (!username) return res.status(400).json({ error: 'missing username' })
  if (!password) return res.status(400).json({ error: 'missing password' })

  const user = await User.findOne({ username })
  if (!user) return res.status(401).json({ error: 'invalid username or password' })

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!passwordCorrect) return res.status(401).json({ error: 'invalid username or password' })

  const tokenPayload = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(tokenPayload, process.env.SECRET, { expiresIn: '1h' })
  res.json({
    token,
    id: user._id,
    username: user.username,
    name: user.name
  })
})

module.exports = loginRouter