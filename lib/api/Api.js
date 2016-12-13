const { Response } = require("./response")
const mediaTypes = require("./mediaType/mediaTypes")

function *_handleAuthentication(next) {
  yield next
}

function *_handleAuthorization(next) {
  yield next
}

function *_handleResponse(next) {
  let handler = this.isa.handlers[this.isa.handlers.length - 1].call(this)
  for (let i = this.isa.handlers.length - 2; i >= 0; i--) {
    handler = this.isa.handlers[i].call(this, handler)
  }
  const response = yield handler
  if (typeof response !== "undefined") {
    if (!(response instanceof Response)) {
      throw new TypeError("API handler must return an instance of Response")
    }
    mediaTypes.represent(this, response)
    if (!this.body || !Object.keys(this.body).length) {
      this.body = ""
      this.remove("Content-Type")
      this.remove("Content-Length")
    }
  }
  yield next
}

module.exports = class Api {

  constructor(router) {
    this.router = router
  }

  map(verb, path, handlers) {
    this.router[verb](path.path,
      function *init(next) {
        this.isa = { path, handlers }
        this.data = {}
        yield next
      },
      _handleAuthentication,
      _handleAuthorization,
      _handleResponse
    )
    return this
  }

  get(path, ...handlers) {
    return this.map("get", path, handlers)
  }

  post(path, ...handlers) {
    return this.map("post", path, handlers)
  }

  put(path, ...handlers) {
    return this.map("put", path, handlers)
  }

  patch(path, ...handlers) {
    return this.map("patch", path, handlers)
  }

  delete(path, ...handlers) {
    return this.map("delete", path, handlers)
  }

}
