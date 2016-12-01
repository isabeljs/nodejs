const _handleError = (context, error) => {
  context.status = error.status || 500
  context.body = error.expose ? error.message : ""
  context.set(error.headers)
  if (!context.body) {
    context.remove("Content-Type")
    context.remove("Content-Length")
  } else {
    context.set("Content-Type", "text/plain")
  }
  context.app.emit("error", error, context)
}

module.exports = function *(next) {
  try {
    yield next
  } catch (error) {
    if (!(error instanceof Error)) {
      error = new Error(error.toString())
    }
    _handleError(this, error)
  }
}
