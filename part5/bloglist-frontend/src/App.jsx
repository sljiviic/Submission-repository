import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: '', type: 0 })

  const blogFormRef = useRef()

  // FETCHES BLOGS
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      } catch {
        setNotification({ message: 'failed to fetch blogs', type: 0 })
      }
    }

    fetchBlogs()
  }, [])

  // FETCHES USER
  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem('loggedinUser'))
    if (user) {
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // CLEARS NOTIFICATION
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ message: '', type: 0 }), 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const login = async credentials => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedinUser', JSON.stringify(user))
      setUser(user)

      blogService.setToken(user.token)
      setNotification({ message: `Logged in successfully as ${user.username}`, type: 1 })
    } catch {
      setNotification({ message: 'Wrong username or password', type: 0 })
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedinUser')
    setUser(null)
    blogService.setToken(null)
  }

  const createBlog = async blog => {
    try {
      const newBlog = await blogService.create(blog)
      blogFormRef.current.toggleVisibility()

      setBlogs([...blogs, newBlog])
      setNotification({ message: `a new blog ${newBlog.title} by ${newBlog.author} added`, type: 1 })
    } catch (exception) {
      setNotification({ message: exception.response.data.error, type: 0 })
    }
  }

  const updateBlog = async blog => {
    try {
      const updatedBlog = await blogService.update(blog.id, blog)
      setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b))
    } catch (exception) {
      setNotification({ message: exception.response.data.error, type: 0 })
    }
  }

  const deleteBlog = async id => {
    await blogService.deleteBlog(id)
    setBlogs(blogs.filter(b => b.id !== id))
    setNotification({ message: 'You have deleted a blog', type: 1 })
  }

  return (
    <div>
      {!user ? (
        <div>
          <h2>log in to application</h2>
          <Notification notification={notification} />
          <LoginForm login={login} />
        </div>
      ) : (
        <div>
          <div>
            <h2>blogs</h2>
            <Notification notification={notification} />
            <span>{user?.name} logged in </span>
            <button type='button' onClick={handleLogout}>logout</button>
          </div>
          <br />
          <div>
            <Togglable buttonLabel='create new blog' ref={blogFormRef}>
              <BlogForm createBlog={createBlog} />
            </Togglable>
          </div>
          <br />
          <div>
            {blogs.toSorted((a, b) => b.likes - a.likes).map(blog =>
              <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} userId={user?.id} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App