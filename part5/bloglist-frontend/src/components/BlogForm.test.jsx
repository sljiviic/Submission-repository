import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('BlogForm component', () => {
  test('calls the event handler with correct details when a new blog is submitted', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()

    render(<BlogForm createBlog={fn} />)

    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')

    await user.type(titleInput, 'title')
    await user.type(authorInput, 'author')
    await user.type(urlInput, 'url')

    const button = screen.getByText('create')
    await user.click(button)

    expect(fn.mock.calls[0][0]).toStrictEqual({ title: 'title', author: 'author', url: 'url' })
  })
})