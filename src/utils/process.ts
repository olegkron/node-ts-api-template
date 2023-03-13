import http from 'http'

export function terminate(server: http.Server, options = { coredump: false, timeout: 500 }) {
	const exit = (code) => {
		options.coredump ? process.abort() : process.exit(code)
	}

	return (code: number, reason: string) => (err: Error | null, promise: Promise<void> | null) => {
		if (err && err instanceof Error) {
			console.error(err.message, err.stack)
		}

		// Attempt a graceful shutdown
		server.close(exit)
		setTimeout(exit, options.timeout).unref()
	}
}

export const addProcessListeners = (server: http.Server) => {
	const exitHandler = terminate(server, { coredump: false, timeout: 500 })
	process.on('uncaughtException', exitHandler(1, 'Unexpected Error'))
	process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'))
	process.on('SIGTERM', exitHandler(0, 'SIGTERM'))
	process.on('SIGINT', exitHandler(0, 'SIGINT'))
}
