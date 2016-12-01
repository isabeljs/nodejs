const HttpError = require("http-errors").HttpError

module.exports = function *(next) {
  try {
    yield next
  } catch (error) {
    if (error instanceof HttpError) {
      throw error
    }
    this.status = 500
    this.body = ""
    this.remove("Content-Type")
    this.remove("Content-Length")
    this.app.emit("error", error, this)
  }
}
