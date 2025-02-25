const { test, describe, beforeEach, before, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)
let token

before(async () => {
  const response = await api
    .post('/api/login')
    .send(helper.rootUser)

  token = response.body.token
})

describe.only('Blog API', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  describe('GET /api/blogs', () => {
    test('returns blogs as JSON with status code 200', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('returns all blogs in the database', async () => {
      const response = await api.get('/api/blogs')
      const blogs = response.body

      assert.strictEqual(blogs.length, helper.initialBlogs.length)
    })

    test('each blog has "id" as the unique identifier property', async () => {
      const response = await api.get('/api/blogs')
      const blogs = response.body

      blogs.forEach(blog => {
        assert.ok(Object.hasOwn(blog, 'id'))
        assert.strictEqual(blog._id, undefined)
      })
    })
  })

  describe('POST /api/blogs', () => {
    test('creates a new blog and increments the total count', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

      const newBlogFromDb = blogsAtEnd.find(blog => blog.title === newBlog.title)
      assert.ok(newBlogFromDb)
      assert.strictEqual(newBlogFromDb.title, newBlog.title)
      assert.strictEqual(newBlogFromDb.author, newBlog.author)
      assert.strictEqual(newBlogFromDb.url, newBlog.url)
      assert.strictEqual(newBlogFromDb.likes, newBlog.likes)
    })

    test('sets "likes" to 0 by default if the likes property is missing', async () => {
      const newBlog = {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      }

      await api
        .post('/api/blogs/')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      const newBlogFromDb = blogsAtEnd.find(blog => blog.title === newBlog.title)
      assert.ok(newBlogFromDb)
      assert.strictEqual(newBlogFromDb.likes, 0)
    })

    test('fails with status code 400 if the title is missing', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })

    test('fails with status code 400 if the URL is missing', async () => {
      const newBlog = {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 401 if a token is not provided', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
  })

  describe('DELETE /api/blogs/:id', () => {
    test('deletes a blog successfully with status code 204', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

      assert.ok(!blogsAtEnd.find(blog => blog.title === blogToDelete.title))
    })
  })

  describe('PUT /api/blogs/:id', () => {
    test('updates the number of likes for a blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlogData = {
        likes: blogToUpdate.likes + 1
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlogData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const newBlogFromDb = response.body
      assert.strictEqual(newBlogFromDb.likes, updatedBlogData.likes)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })

    test('updates an entire blog post successfully', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlogData = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlogData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const newBlogFromDb = response.body
      assert.strictEqual(newBlogFromDb.title, updatedBlogData.title)
      assert.strictEqual(newBlogFromDb.author, updatedBlogData.author)
      assert.strictEqual(newBlogFromDb.url, updatedBlogData.url)
      assert.strictEqual(newBlogFromDb.likes, updatedBlogData.likes)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
