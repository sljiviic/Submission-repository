const express = require('express')
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const userRouter = require('./controllers/users')
const blogRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')

const app = express()

mongoose.set('strictQuery', false)

logger.info(`connecting to ${config.MONGODB_URI}`)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error(`error connecting to mongoDB: ${error.message}`)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
morgan.token('reqData', req => JSON.stringify(req.body))
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqData'))
}

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app