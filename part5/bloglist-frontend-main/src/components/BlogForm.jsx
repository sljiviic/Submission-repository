const BlogForm = ({ title, author, url, handleNewBlog, handleTitle, handleAuthor, handleUrl }) => {
  return (
    <form onSubmit={handleNewBlog}>
      <div>
        <label htmlFor="title">Title: </label>
        <input type="text" id="title" name="title" value={title} onChange={handleTitle} />
      </div>
      <div>
        <label htmlFor="author">Author: </label>
        <input type="text" id="author" name="author" value={author} onChange={handleAuthor} />
      </div>
      <div>
        <label htmlFor="url">URL: </label>
        <input type="text" id="url" name="url" value={url} onChange={handleUrl} />
      </div>
      <button type="submit">Create</button>
    </form>
  )
}

export default BlogForm