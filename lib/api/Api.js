const Response = require("./response").Response
const mediaTypes = require("./mediaType/mediaTypes")

const _handleAuthentication = function *(next) {
  yield next
}

const _handleAuthorization = function *(next) {
  yield next
}

const _convertResponse = (context, response) => {
  const mediaType = mediaTypes.convert(context, response)
  if (Object.keys(context.body).length > 0) {
    context.response.set("Content-Type", mediaType)
  } else {
    context.body = ""
    context.remove("Content-Type")
    context.remove("Content-Length")
  }
}

const _handleResponseConversionError = (context, error) => {
  if (error instanceof Error) {
    throw error
  }
  context.status = error.status
  context.body = error.payload
  context.response.set("Content-Type", "application/json")
}

const _handleResponse = function *() {
  const response = yield this.ron.handler.call(this)
  if (typeof response !== "undefined") {
    if (!(response instanceof Response)) {
      throw new TypeError("API handler must return an instance of Response")
    }
    try {
      _convertResponse(this, response)
    } catch (error) {
      _handleResponseConversionError(this, error)
    }
  }
}

class Api {

  constructor(router) {
    this.router = router
  }

  map(verb, path, handler) {
    this.router[verb](path.path,
      function *(next) {
        this.ron = { path: path, handler: handler }
        yield next
      },
      _handleAuthentication,
      _handleAuthorization,
      _handleResponse
    )
    return this
  }

  get(path, handler) {
    return this.map("get", path, handler)
  }

  post(path, handler) {
    return this.map("post", path, handler)
  }

  put(path, handler) {
    return this.map("put", path, handler)
  }

  patch(path, handler) {
    return this.map("patch", path, handler)
  }

  delete(path, handler) {
    return this.map("delete", path, handler)
  }

}

module.exports = Api
