const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.post('/', async (req, res) => {
  const { username, password, name } = req.body

  if (!password || password.length < 3) {
    return res.status(400).json({ error: 'A password is required and must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { likes: 0, user: 0 })
  res.json(users)
})

module.exports = userRouter