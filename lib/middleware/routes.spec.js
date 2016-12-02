require("co-mocha")

const should = require("should")
const sinon = require("sinon")
const request = require("supertest-koa-agent")

const appBuilder = require("koa")
const routerBuilder = require("koa-router")

const middleware = require("./")
const Api = require("../api/Api")

describe("routes", () => {

  it("should allow registering no middleware", function *() {
    const router = routerBuilder().get("/foobar", function *() {
      this.throw(501)
    })
    const app = appBuilder().use(router.routes()).use(router.allowedMethods())
    yield request(app).get("/foobar")
      .expect(501, "Not Implemented")
  })

  it("should allow registering only errors middleware", function *() {

    const router = routerBuilder().get("/foobar", function *() {
      this.throw(501)
    }).post("/foobar", function *() {
      this.body = this.request.body || "no request body"
    })

    const app = appBuilder()
    const spy = sinon.spy(app, "use")
    app.use(middleware()).use(router.routes()).use(router.allowedMethods())
    spy.callCount.should.equal(3)

    yield request(app).get("/foobar")
      .expect(501, "")
    yield request(app).post("/foobar")
      .send({ foo: "bar" })
      .expect(200, "no request body")

  })

  it("should allow registering only errors and bodyParser middlewares", function *() {
    const router = routerBuilder().post("/foobar", function *() {
      this.body = this.request.body || "no request body"
    })
    const app = appBuilder()
    const spy = sinon.spy(app, "use")
    app.use(middleware(app)).use(router.routes()).use(router.allowedMethods())
    spy.callCount.should.equal(5)
    yield request(app).post("/foobar")
      .send({ foo: "bar" })
      .expect(200, { foo: "bar" })
  })

  it("should handle multiple APIs based on the same router", function *() {
    const router = routerBuilder()
    const app = appBuilder()
    const spy = sinon.spy(app, "use")
    app.use(middleware(app, [new Api(router), new Api(router)]))
    spy.callCount.should.equal(5)
  })

  it("should handle multiple APIs based on different routers", function *() {
    const app = appBuilder()
    const spy = sinon.spy(app, "use")
    app.use(middleware(app, [new Api(routerBuilder()), new Api(routerBuilder())]))
    spy.callCount.should.equal(7)
  })

  it("should fail when passing arguments that are not instances of Api", function *() {
    const app = appBuilder()
    let registered = false
    try {
      app.use(middleware(app, ["foobar"]))
      registered = true
    } catch (error) {
      error.should.be.an.instanceOf(TypeError)
      error.message.should.equal("Middleware expects Api instances as arguments")
    } finally {
      registered.should.be.false()
    }
  })

})
