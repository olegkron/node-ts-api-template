import type http from 'http'

//! ISSUE: does not clear up the port after server is closed. (eg when ctrl+c is pressed)
export function terminate (server, options = { coredump: false, timeout: 500 }) {
  const exit = code => {
    options.coredump ? process.abort() : process.exit(code)
  }

  const shutdown = () => {
    if (server.listening) {
      server.close(() => {
        console.log('Server closed')
        exit(0)
      })
    } else {
      exit(0)
    }
  }

  return (code, reason) => (err, promise) => {
    if (err && err instanceof Error) {
      console.error(err.message, err.stack)
    }

    // Attempt a graceful shutdown
    shutdown()

    setTimeout(() => {
      console.log('Forcing server termination')
      exit(1)
    }, options.timeout).unref()
  }
}

export const addProcessListeners = (server: http.Server) => {
  const exitHandler = terminate(server, { coredump: false, timeout: 500 })
  process.on('uncaughtException', () => exitHandler(1, 'Unexpected Error'))
  process.on('unhandledRejection', () => exitHandler(1, 'Unhandled Promise'))
  process.on('SIGTERM', () => exitHandler(0, 'SIGTERM'))
  process.on('SIGINT', () => exitHandler(0, 'SIGINT'))
}
