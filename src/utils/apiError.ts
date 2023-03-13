class apiError {
	code: number
	message: string
	from: string
	params: Object
	constructor(code: number, message: string, from: string, params?: Object) {
		this.code = code
		this.message = message
		this.from = from
		this.params = params
	}

	static forbidden(msg: string, from: string, params?: Object) {
		return new apiError(403, msg, from, params)
	}
	static unauthorized(msg: string, from: string, params?: Object) {
		return new apiError(401, msg, from, params)
	}
	static badRequest(msg: string, from: string, params?: Object) {
		return new apiError(400, msg, from, params)
	}
	static notFound(msg: string, from: string, params?: Object) {
		return new apiError(404, msg, from, params)
	}
	static internal(msg: string, from: string) {
		return new apiError(500, msg, from)
	}
}
export default apiError
