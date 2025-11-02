import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [blog, setBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const handleCreateBlog = e => {
    e.preventDefault()
    setBlog({
      title: '',
      author: '',
      url: ''
    })
    createBlog(blog)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={handleCreateBlog}>
        <div>
          <label>
            title:
            <input
              type="text"
              value={blog.title}
              onChange={({ target }) => setBlog({ ...blog, title: target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type="text"
              value={blog.author}
              onChange={({ target }) => setBlog({ ...blog, author: target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type="text"
              value={blog.url}
              onChange={({ target }) => setBlog({ ...blog, url: target.value })}
            />
          </label>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm