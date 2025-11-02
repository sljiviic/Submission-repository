const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()

  const blog = page
    .getByTestId('title')
    .filter({ hasText: title })
    .locator('..')

  await blog.waitFor()
  return blog
}

const likeBlog = async (expect, blog, times) => {
  const likesElement = blog.getByTestId('likes')
  const likeButton = blog.getByRole('button', { name: 'like' })
  for (let i = 0; i < times; i++) {
    const currentLikes = Number(await likesElement.innerText())
    await likeButton.click()
    await expect(likesElement).toHaveText(String(currentLikes + 1))
  }
}

module.exports = {
  loginWith,
  createBlog,
  likeBlog
}