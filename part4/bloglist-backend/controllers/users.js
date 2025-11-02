const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')


usersRouter.post('/', async (req, res) => {
  const { username, password, name } = req.body

  if (!password || password.length < 3) {
    return res.status(400).json({ error: 'A password is required and must be at least 3 characters long' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    passwordHash,
    name
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { user: 0 })
  res.json(users)
})

module.exports = usersRouter