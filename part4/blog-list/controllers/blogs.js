const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (req, res) => {
  const body = req.body
  const user = req.user

  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author,
    user: user._id,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  user.blogs.push(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

blogRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const id = req.params.id
  const user = req.user

  const blog = await Blog.findById(id)
  if (blog.user.toString() === user._id.toString()) {
    await blog.deleteOne()
    return res.status(204).end()
  }

  res.status(403).json({ error: 'you are not authorized to delete this blog' })
})

blogRouter.put('/:id', async (req, res) => {
  const id = req.params.id
  const body = req.body

  const blog = {
    url: body.url,
    title: body.title,
    author: body.author,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true, runValidators: true })

  if (!updatedBlog) {
    return res.status(404).json({ error: 'Blog not found' })
  }

  res.json(updatedBlog)
})

module.exports = blogRouter