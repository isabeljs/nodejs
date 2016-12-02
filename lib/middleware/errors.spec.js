require("co-mocha")

const should = require("should")
const request = require("supertest-koa-agent")

const appBuilder = require("koa")
const routerBuilder = require("koa-router")
const bodyParser = require("koa-bodyparser")

const errors = require("./errors")
const Api = require("../api/Api")
const path = require("../api/path")

describe("errors", () => {

  const _checkResponseHasNoHeaders = (response, headers) => {
    const actualHeaders = Object.keys(response.headers).map(header => header.toLowerCase())
    headers.filter(header => actualHeaders.indexOf(header.toLowerCase()) >= 0).length.should.equal(0)
  }

  const _createApp = routerDecorator => {
    const router = routerBuilder()
    routerDecorator(new Api(router))
    return appBuilder().use(errors).use(bodyParser()).use(router.routes()).use(router.allowedMethods())
  }

  it("should respond with a 500 status code and an empty body when an error is catched", function *() {

    const app = _createApp(router => {

      router.get(path.path("/foobar1"), function *() {
        throw "Foobar"
      }).get(path.path("/foobar2"), function *() {
        throw new Error("Foobar")
      })

    })

    const response1 = yield request(app).get("/foobar1")
      .expect(500, "")
    _checkResponseHasNoHeaders(response1, ["Content-Type", "Content-Length"])

    const response2 = yield request(app).get("/foobar2")
      .expect(500, "")
    _checkResponseHasNoHeaders(response2, ["Content-Type", "Content-Length"])

  })

  it("should allow using koa this.throw for client errors", function *() {

    const app = _createApp(router => {

      router.get(path.path("/foobar1"), function *() {
        this.throw(401)
      }).get(path.path("/foobar2"), function *() {
        this.throw(401, "Foobar")
      })

    })

    const response1 = yield request(app).get("/foobar1")
      .expect(401, "")
    _checkResponseHasNoHeaders(response1, ["Content-Type", "Content-Length"])

    yield request(app).get("/foobar2")
      .expect("Content-Type", "text/plain")
      .expect(401, "Foobar")

  })

  it("should allow using koa this.throw for server errors without exposing the message", function *() {
    const app = _createApp(router => {

      router.get(path.path("/foobar"), function *() {
        this.throw(501, "Foobar")
      })

    })
    const response = yield request(app).get("/foobar")
      .expect(501, "")
    _checkResponseHasNoHeaders(response, ["Content-Type", "Content-Length"])
  })

  it("should allow using koa this.throw for server errors while exposing the message", function *() {
    const app = _createApp(router => {

      router.get(path.path("/foobar"), function *() {
        this.throw(501, "Foobar", { expose: true })
      })

    })
    yield request(app).get("/foobar")
      .expect("Content-Type", "text/plain")
      .expect(501, "Foobar")
  })

  it("should allow using koa this.throw while overwriting the Content-Type header if any", function *() {
    const app = _createApp(router => {

      router.get(path.path("/foobar"), function *() {
        this.throw(501, "Foobar", { expose: true, headers: { "content-type": "application/octet-stream", "x-custom-header": "foobar" } })
      })

    })
    yield request(app).get("/foobar")
      .expect("Content-Type", "text/plain")
      .expect("X-Custom-Header", "foobar")
      .expect(501, "Foobar")
  })

  it("should allow using koa this.assert", function *() {
    const app = _createApp(router => {

      router.get(path.path("/foobar"), function *() {
        this.assert(false, 401, "Foobar")
      })

    })
    yield request(app).get("/foobar")
      .expect("Content-Type", "text/plain")
      .expect(401, "Foobar")
  })

})
