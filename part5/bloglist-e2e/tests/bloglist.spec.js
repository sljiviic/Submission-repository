const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'user',
        username: 'user',
        password: 'password123'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'user', 'password123')
      await expect(page.getByText('user logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'user', 'wrong')
      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('user logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'user', 'password123')
    })

    test('a new blog can be created', async ({ page }) => {
      const blog = await createBlog(page, 'A blog created by playwright', 'Playwright', 'test.com')
      await expect(blog).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      const blog = await createBlog(page, 'A blog created by playwright', 'Playwright', 'test.com')

      await page.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByTestId('likes')).toHaveText('0')

      await page.getByRole('button', { name: 'like' }).click()
      await expect(blog.getByTestId('likes')).toHaveText('1')
    })

    test('the user who added the blog can delete it', async ({ page }) => {
      page.once('dialog', async dialog => {
        await dialog.accept()
      })

      const blog = await createBlog(page, 'A blog created by playwright', 'Playwright', 'test.com')
      await expect(blog).toBeVisible()

      await blog.getByRole('button', { name: 'view' }).click()
      await blog.getByRole('button', { name: 'remove' }).click()

      await expect(blog).not.toBeVisible()
    })

    test('only the user who added the blog sees the delete button', async ({ page, request }) => {
      await request.post('/api/users', {
        data: {
          name: 'user2',
          username: 'user2',
          password: 'password123'
        }
      })

      const blog = await createBlog(page, 'A blog created by playwright', 'Playwright', 'test.com')
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()

      await loginWith(page, 'user2', 'password123')
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are arranged in the order according to the likes', async ({ page }) => {
      const blog1 = await createBlog(page, 'blog1', 'author1', 'test.com')
      const blog2 = await createBlog(page, 'blog2', 'author2', 'test.com')
      const blog3 = await createBlog(page, 'blog3', 'author3', 'test.com')

      while (await page.getByRole('button', { name: 'view' }).count()) {
        await page.getByRole('button', { name: 'view' }).first().click()
      }

      await likeBlog(expect, blog1, 1)
      await likeBlog(expect, blog2, 3)
      await likeBlog(expect, blog3, 2)

      await expect(page.getByTestId('likes')).toHaveText(['3', '2', '1'])
    })
  })
})