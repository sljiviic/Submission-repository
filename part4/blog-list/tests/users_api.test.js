const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('User API', () => {
  beforeEach(async () => {
    User.deleteMany({ username: { $ne: 'root' } })
  })

  describe('POST /api/users', () => {
    test('Fails if username is not given with a 400 status code and a proper error message', async () => {
      const usersAtStart = await helper.usersInDb()

      const user = {
        name: 'user1',
        password: 'strongpass123'
      }

      const response = await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)

      assert.ok(response.body.error.includes('`username` is required.'))
    })

    test('Fails if username is shorter than 3 characters with a 400 status code and a proper error message', async () => {
      const usersAtStart = await helper.usersInDb()

      const user = {
        username: 'u1',
        name: 'user1',
        password: 'strongpass123'
      }

      const response = await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)

      assert.ok(response.body.error.includes('shorter than the minimum allowed length '))
    })

    test('Fails if username is a duplicate with a 400 status code and a proper error message', async () => {
      const usersAtStart = await helper.usersInDb()

      const user = {
        username: 'root',
        name: 'root',
        password: 'strongpass123'
      }

      const response = await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)

      assert.ok(response.body.error.includes('expected `username` to be unique'))
    })

    test('Fails if password is not given with a 400 status code and a proper error message', async () => {
      const usersAtStart = await helper.usersInDb()

      const user = {
        username: 'user1',
        name: 'user1'
      }

      const response = await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)

      assert.ok(response.body.error.includes('A password is required'))
    })

    test('Fails if password is shorter than 3 characters with a 400 status code and a proper error message', async () => {
      const usersAtStart = await helper.usersInDb()

      const user = {
        username: 'user1',
        name: 'user1',
        password:'u1'
      }

      const response = await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)

      assert.ok(response.body.error.includes('must be at least 3 characters long'))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})