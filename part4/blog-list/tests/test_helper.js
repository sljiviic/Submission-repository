const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    likes: 5,
  },
  {
    url: 'https://reactpatterns.com/',
    title: 'React patterns',
    author: 'Michael Chan',
    likes: 7,
  }
]

const rootUser = {
  username: 'root',
  password: 'root123'
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({
    author: 'test purpose',
    url: 'https://testpurpose.unavailableurl.com/'
  })

  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
  usersInDb,
  rootUser
}