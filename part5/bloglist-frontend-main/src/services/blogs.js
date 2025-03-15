import axios from 'axios'
const baseUrl = '/api/blogs'

let token

const setToken = (fetchedToken) => {
  token = `Bearer ${fetchedToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async blog => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

export default { getAll, setToken, create }