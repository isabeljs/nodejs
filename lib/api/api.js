const mediaTypesHolder = require("./mediaType/mediaTypesHolder")

function *_handleAuthentication(next) {
  yield next
}

function *_handleAuthorization(next) {
  yield next
}

function *_handleResponse() {
  const response = yield this.ron.handler.call(this)
  if (response) {
    try {
      let mediaType = mediaTypesHolder.convert(this, response)
      this.response.set("Content-Type", mediaType)
    } catch (error) {
      this.status = 406
      this.body = error
      this.response.set("Content-Type", "application/json")
    }
  }
}

class Api {

  constructor(router) {
    this.router = router
  }

  map(verb, path, handler) {
    this.router[verb](path.path,
      function *init(next) {
        this.ron = {
          path: path,
          handler: handler
        }
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

module.exports = router => new Api(router)
