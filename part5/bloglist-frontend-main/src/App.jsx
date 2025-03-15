import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState({ message: '', type: 0 })

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    const user = window.localStorage.getItem('LoggedinUser')
    if (user) {
      const parsedUser = JSON.parse(user)
      setUser(parsedUser)
      blogService.setToken(parsedUser.token)
    }
  }, [])

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ message: '', type: 0 }), 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('LoggedinUser', JSON.stringify(user))

      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      setNotification({ message: `Logged in successfully as ${user.username}`, type: 1 })
    } catch (exception) {
      setNotification({ message: 'Wrong username or password', type: 0 })
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('LoggedinUser')
    setUser(null)
    blogService.setToken(null)
  }

  const handleNewBlog = async event => {
    try {
      event.preventDefault()
      const newBlog = await blogService.create({ title, author, url })

      const blogsArr = blogs.concat(newBlog)
      setBlogs(blogsArr)

      setNotification({ message: `a new blog ${newBlog.title} by ${newBlog.author} added`, type: 1 })
    } catch (exception) {
      setNotification({ message: exception.response.data.error, type: 0 })
    }
  }

  if (user === null) return (
    <div>
      <h2>Log in to application</h2>
      <Notification
        notification={notification}
      />
      <LoginForm
        username={username}
        password={password}
        handleLogin={handleLogin}
        handleUsername={({ target }) => setUsername(target.value)}
        handlePassword={({ target }) => setPassword(target.value)}
      />
    </div>
  )

  return (
    <div>
      <div>
        <h2>Blogs</h2>
        <Notification
          notification={notification}
        />
        <span>{user.name} logged in </span>
        <button type='button' onClick={handleLogout}>Logout</button>
      </div>

      <div>
        <h2>Create new</h2>
        <BlogForm
          title={title}
          author={author}
          url={url}
          handleNewBlog={handleNewBlog}
          handleTitle={({ target }) => setTitle(target.value)}
          handleAuthor={({ target }) => setAuthor(target.value)}
          handleUrl={({ target }) => setUrl(target.value)}
        />
      </div>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App