/* eslint-disable func-names, require-yield, max-statements, no-magic-numbers */

require("co-mocha")

const should = require("should") // eslint-disable-line no-unused-vars
const sinon = require("sinon")
const request = require("supertest-koa-agent")

const appBuilder = require("koa")
const routerBuilder = require("koa-router")

const middleware = require("../middleware/")
const Api = require("./Api")
const Response = require("./response").Response
const path = require("./path")
const hal = require("./mediaType/impl/hal")
const mediaTypes = require("./mediaType/mediaTypes")

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

  it("should allow using multiple handlers", function *() {

    mediaTypes.register([hal])

    const handlers = {
      *handler1(next) {
        arguments.length.should.equal(1)
        this.data.foo = "bar"
        return yield next
      },
      *handler2() {
        arguments.length.should.equal(0)
        this.data.foo.should.equal("bar")
        return new Response(201)
      }
    }

    const spy1 = sinon.spy(handlers, "handler1")
    const spy2 = sinon.spy(handlers, "handler2")

    const app = _createApp(router => router

      .get(path.path("/foobar"), handlers.handler1, handlers.handler2)

    )

    const response = yield request(app).get("/foobar")
      .expect(201, "")
    _checkResponseHasNoHeaders(response, ["Content-Type", "Content-Length"])

    spy1.calledOnce.should.be.true()
    spy2.calledOnce.should.be.true()

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

  afterEach(() => {
    mediaTypes.clear()
  })

})
