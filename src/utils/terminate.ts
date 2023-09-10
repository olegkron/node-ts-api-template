export function terminate(server, options = { coredump: false, timeout: 500 }) {
  // Exit function

  const exit = (code) => {
    options.coredump ? process.abort() : process.exit(code)
  }

  return (code: number, reason: string) => (err: Error | null, promise: Promise<void> | null) => {
    if (err && err instanceof Error) {
      console.error('trying to exit with logging')
      console.error(err.message, err.stack)
    }

    // Attempt a graceful shutdown
    server.close(exit)
    setTimeout(exit, options.timeout).unref()
  }
}
