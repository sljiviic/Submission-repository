const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, value) => {
    return acc + value.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const mostLikedBlog = blogs.reduce((topBlog, currentBlog) =>
    currentBlog.likes > (topBlog.likes || 0) ? currentBlog : topBlog
    , {})

  return {
    title: mostLikedBlog.title,
    author: mostLikedBlog.author,
    likes: mostLikedBlog.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const countBlogs = {}

  blogs.forEach(blog => {
    countBlogs[blog.author] = (countBlogs[blog.author] || 0) + 1
  })

  let topAuthor
  let mostBlogs = 0

  for (const key in countBlogs) {
    if (countBlogs[key] > mostBlogs) {
      mostBlogs = countBlogs[key]
      topAuthor = key
    }
  }

  return {
    author: topAuthor,
    blogs: mostBlogs
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const countLikes = {}

  blogs.forEach(blog => {
    countLikes[blog.author] = (countLikes[blog.author] || 0) + blog.likes
  })

  let topAuthor
  let likesSum = 0

  for (const author in countLikes) {
    if (countLikes[author] > likesSum) {
      likesSum = countLikes[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    likes: likesSum
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}