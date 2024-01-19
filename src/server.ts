import express from 'express'
import * as http from 'http'
import apicache from 'apicache'
import morgan from 'morgan'
import compression from 'compression'
import { config } from './constants'
import { apiError, apiErrorHandler, connect } from './utils'
import { killProcessOnPort } from './utils/killProcessOnPort'
import { socketIO } from './utils/socketio'

export const app = express()
app.use(compression())
app.use(apicache.middleware('5 minutes'))
app.use(express.json())
app.disable('etag')
app.use(morgan('dev'))

// app.use('/uploads', express.static('uploads'))
// app.use('/api', protect, router)
// app.post('/signup', use(signup))
// app.post('/signin', use(signin))
// app.use('/static', express.static('static'))

app.use(({ next }) => {
  next(new apiError(404, 'Not found', 'server'))
})
app.use(apiErrorHandler)

export const server = () => {
  try {
    killProcessOnPort(config.port, () => {
      connect()
      const httpServer = http.createServer(app)
      httpServer.listen(config.port, () => {
        console.log(`Server listening on port ${config.port}`)
      })
      socketIO(httpServer)
    })
  } catch (error) {
    console.error('[server] ', error)
  }
}
