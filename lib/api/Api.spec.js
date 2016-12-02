require("co-mocha")

const should = require("should")
const request = require("supertest-koa-agent")

const appBuilder = require("koa")
const routerBuilder = require("koa-router")

const middleware = require("../middleware/")
const Api = require("./Api")
const path = require("./path")

describe("Api", () => {

  const _checkResponseHasNoHeaders = (response, headers) => {
    const actualHeaders = Object.keys(response.headers).map(header => header.toLowerCase())
    headers.filter(header => actualHeaders.indexOf(header.toLowerCase()) >= 0).length.should.equal(0)
  }

  const _createApp = routerDecorator => {
    const router = routerBuilder()
    const app = appBuilder()
    return app.use(middleware(app, [routerDecorator(new Api(router))]))
  }

  it("should allow using koa handlers", function *() {
    const app = _createApp(router => router

      .get(path.path("/foobar"), function *() {
        this.status = 201
        this.body = { foo: "bar" }
      })

    )
    yield request(app).get("/foobar")
      .expect(201, { foo: "bar" })
  })

  it("should fail if API handler returns an object that is not an instance of Response", function *() {
    const app = _createApp(router => router

      .get(path.path("/foobar"), function *() {
        return { foo: "bar" }
      })

    )
    const response = yield request(app).get("/foobar")
      .expect(500, "")
    _checkResponseHasNoHeaders(response, ["Content-Type", "Content-Length"])
  })

})
