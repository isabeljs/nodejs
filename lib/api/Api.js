const Response = require("./response").Response
const mediaTypes = require("./mediaType/mediaTypes")

const _handleAuthentication = function *(next) {
  yield next
}

const _handleAuthorization = function *(next) {
  yield next
}

const _handleResponse = function *() {
  const response = yield this.ron.handler.call(this)
  if (typeof response !== "undefined") {
    if (!(response instanceof Response)) {
      throw new TypeError("API handler must return an instance of Response")
    }
    const mediaType = mediaTypes.convert(this, response)
    if (Object.keys(this.body).length > 0) {
      this.response.set("Content-Type", mediaType)
    } else {
      this.body = ""
      this.remove("Content-Type")
      this.remove("Content-Length")
    }
  }
}

const Api = class {

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
