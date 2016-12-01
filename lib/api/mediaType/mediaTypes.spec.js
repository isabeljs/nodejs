require("co-mocha")

const should = require("should")
const request = require("supertest-koa-agent")

const appBuilder = require("koa")
const routerBuilder = require("koa-router")
const bodyParser = require("koa-bodyparser")

const middleware = require("../../middleware/")
const Api = require("../Api")
const path = require("../path")
const response = require("../response")

const hal = require("./impl/hal")
const mediaTypes = require("./mediaTypes")

describe("mediaTypes", () => {

  const _createApp = routerDecorator => {
    const router = routerBuilder()
    routerDecorator(new Api(router))
    return appBuilder().use(middleware).use(bodyParser()).use(router.routes()).use(router.allowedMethods())
  }

  it("should fail if no media-type has been registered", function *() {
    const app = _createApp(router => {

      router.get(path.path("/foobar"), function *() {
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

      router.get(path.path("/foobar"), function *() {
        return response.ok({ foo: "bar" })
      })

    })
    yield request(app).get("/foobar")
      .set("Accept", "application/xml")
      .expect("Content-Type", "text/plain")
      .expect(406, "None of the supported media-types ['application/hal+json'] matched the Accept header 'application/xml'")
  })

  afterEach(() => {
    mediaTypes.clear()
  })

})
