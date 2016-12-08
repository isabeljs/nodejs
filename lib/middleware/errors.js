const statuses = require("statuses")

const _handleError = (context, error) => {
  context.status = error.status || 500
  context.body = error.expose ? error.message : ""
  if (context.body === statuses[context.status]) {
    context.body = ""
  }
  context.set(error.headers)
  if (!context.body) {
    context.remove("Content-Type")
    context.remove("Content-Length")
  } else {
    context.set("Content-Type", "text/plain")
  }
  context.app.emit("error", error, context)
}

module.exports = function *errors(next) {
  try {
    yield next
  } catch (error) {
    if (!(error instanceof Error)) {
      error = new Error(error)
    }
    _handleError(this, error)
  }
}
