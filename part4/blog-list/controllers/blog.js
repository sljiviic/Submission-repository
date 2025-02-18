const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogRouter.post('/', async (req, res) => {
  const body = req.body

  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'a title or a url is missing' })
  }

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  const newBlogFromDb = await newBlog.save()
  res.status(201).json(newBlogFromDb)
})

blogRouter.delete('/:id', async (req, res) => {
  const id = req.params.id

  await Blog.findByIdAndDelete(id)
  res.status(204).end()
})

blogRouter.put('/:id', async (req, res) => {
  const id = req.params.id
  const blog = req.body

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true, runValidators: true })

  if (!updatedBlog) {
    return res.status(404).json({ error: 'Blog not found' })
  }

  res.json(updatedBlog)
})

module.exports = blogRouter