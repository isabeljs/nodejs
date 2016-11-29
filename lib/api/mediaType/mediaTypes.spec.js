require("co-mocha")

const should = require("should")
const request = require("supertest-koa-agent")

const appBuilder = require("koa")
const routerBuilder = require("koa-router")
const bodyParser = require("koa-bodyparser")

const api = require("../api")
const path = require("../path")
const response = require("../response")

const hal = require("./impl/hal")
const mediaTypes = require("./mediaTypes")

describe("mediaTypes", () => {

  const _createApp = routerDecorator => {
    const router = routerBuilder()
    routerDecorator(router)
    return appBuilder().use(bodyParser()).use(router.routes())
  }

  it("should fail if no media-type has been registered", function *() {
    const app = _createApp(router => {

      api(router).get(path.path("/foobar"), function *() {
        return response.ok({ foo: "bar" })
      })

    })
    yield request(app).get("/foobar")
      .expect(500, {})
  })

  it("should fail when trying to register a media-type that is not an instance of MediaType", () => {
    let registered = false
    try {
      mediaTypes.register({ foo: "bar" })
      registered = true
    } catch (error) {
      error.should.be.an.instanceOf(TypeError)
      error.message.should.equal("Supported media-types must be instances of MediaType")
    } finally {
      registered.should.be.false()
    }
  })

  it("should fail when request's Accept header does not match any supported media-type", function *() {
    mediaTypes.register(hal)
    const app = _createApp(router => {

      api(router).get(path.path("/foobar"), function *() {
        return response.ok({ foo: "bar" })
      })

    })
    yield request(app).get("/foobar")
      .set("Accept", "application/xml")
      .expect("Content-Type", "application/json")
      .expect(406, {
        message: "None of the supported media-types matched the Accept header",
        acceptHeader: "application/xml",
        supportedMediaTypes: ["application/hal+json"]
      })
  })

  afterEach(() => {
    mediaTypes.clear()
  })

})
