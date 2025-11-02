import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog component', () => {
  test('renders the title and author by default', () => {
    const blog = {
      title: 'blog title',
      author: 'blog author',
      url: 'blog url',
      likes: 'blog likes'
    }

    render(<Blog blog={blog} />)

    const summary = screen.getByText(`${blog.title} ${blog.author}`)
    expect(summary).toBeVisible()

    const details = screen.queryByText(blog.url, { exact: false })
    expect(details).toBeNull()
  })

  test('renders detailed view when the button is clicked', async () => {
    const blog = {
      title: 'blog title',
      author: 'blog author',
      url: 'blog url',
      likes: 'blog likes'
    }

    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const summary = screen.queryByText(`${blog.title} ${blog.author}`)
    expect(summary).toBeNull()

    const details = screen.getByText(blog.url, { exact: false })
    expect(details).toBeVisible()
  })

  test('if the button is clicked twice, the event handler is called twice', async () => {
    const blog = {
      title: 'blog title',
      author: 'blog author',
      url: 'blog url',
      likes: 'blog likes'
    }

    const fn = vi.fn()

    render(<Blog blog={blog} updateBlog={fn} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(fn.mock.calls).toHaveLength(2)
  })
})