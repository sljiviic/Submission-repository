const express = require('express')
const app = express()

const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blog')
const config = require('./utils/config')
const logger = require('./utils/logger')
const morgan = require('morgan')

mongoose.set('strictQuery', false)

logger.info(`connecting to ${config.MONGODB_URI}`)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error(`error connecting to mongoDB: ${error.message}`)
  })

// const corsOptions = {
//   origin: 'http://localhost:5173'
// }

app.use(cors())
app.use(express.json())
morgan.token('reqData', req => JSON.stringify(req.body))
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqData'))
}

app.use('/api/blogs', blogRouter)

module.exports = app