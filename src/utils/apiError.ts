class apiError {
  code: Number;
  message: String;
  from: String;
  params: Object;
  constructor(code: Number, message: String, from: String, params?: Object) {
    this.code = code;
    this.message = message;
    this.from = from;
    this.params = params;
  }

  static forbidden(msg: String, from: String, params?: Object) {
    return new apiError(403, msg, from, params);
  }
  static unauthorized(msg: String, from: String, params?: Object) {
    return new apiError(401, msg, from, params);
  }
  static badRequest(msg: String, from: String, params?: Object) {
    return new apiError(400, msg, from, params);
  }
  static notFound(msg: String, from: String, params?: Object) {
    return new apiError(404, msg, from, params);
  }
  static internal(msg: String, from: String) {
    return new apiError(500, msg, from);
  }
}
export default apiError;
