import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, userId }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const blogStyle = {
    padding: '10px 0 5px 2px',
    border: '1px solid',
    marginBottom: 5,
  }

  const handleUpdateBlog = (e) => {
    e.preventDefault()
    updateBlog({ ...blog, likes: blog.likes + 1 })
  }

  const handleDeleteBlog = (e) => {
    e.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }

  const toggleView = () => setIsExpanded(!isExpanded)

  const canRemove = userId === blog.user || userId === blog.user?.id

  return (
    <div style={blogStyle}>
      {!isExpanded ? (
        <div>
          <span data-testid='title'>{blog.title}{' '}</span>
          <span data-testid='author'>{blog.author}{' '}</span>
          <button onClick={toggleView}>view</button>
        </div>
      ) : (
        <div>
          <span data-testid='title'>{blog.title}{' '}</span>
          <button onClick={toggleView}>hide</button><br />
          <span data-testid='url'>{blog.url}</span><br />
          <span data-testid='likes'>{blog.likes}{' '}</span>
          <button onClick={handleUpdateBlog}>like</button><br />
          <span data-testid='author'>{blog.author}</span>
          {canRemove && (
            <div>
              <button
                onClick={handleDeleteBlog}
                style={{
                  backgroundColor: '#2c3affff',
                  color: '#fff',
                  border: '1px solid #727272ff',
                  borderRadius: 3,
                }}
              >
                remove
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog