import axios from 'axios'
const baseUrl = '/api/blogs'

let token

const setToken = (fetchedToken) => {
  token = `Bearer ${fetchedToken}`
}

const getAll = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}

const create = async blog => {
  const config = {
    headers: { Authorization: token }
  }

  const res = await axios.post(baseUrl, blog, config)
  return res.data
}

const deleteBlog = async id => {
  const config = {
    headers: { Authorization: token }
  }

  const res = await axios.delete(`${baseUrl}/${id}`, config)
  return res.data
}

const update = async (id, blog) => {
  const res = await axios.put(`${baseUrl}/${id}`, blog)
  return res.data
}

export default {
  getAll,
  create,
  setToken,
  update,
  deleteBlog
}