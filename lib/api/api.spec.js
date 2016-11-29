require("co-mocha")

const should = require("should")
const request = require("supertest-koa-agent")

const appBuilder = require("koa")
const routerBuilder = require("koa-router")
const bodyParser = require("koa-bodyparser")

const api = require("./api")
const path = require("./path")
const response = require("./response")

describe("api", () => {

  const _createApp = routerDecorator => {
    const router = routerBuilder()
    routerDecorator(router)
    return appBuilder().use(bodyParser()).use(router.routes())
  }

  it("should allow using koa handlers", function *() {
    const app = _createApp(router => {

      api(router).get(path.path("/foobar"), function *() {
        this.status = 201
        this.body = { foo: "bar" }
      })

    })
    yield request(app).get("/foobar")
      .expect(201, { foo: "bar" })
  })

  it("should fail if API handler returns an object that is not an instance of Response", function *() {
    const app = _createApp(router => {

      api(router).get(path.path("/foobar"), function *() {
        return { foo: "bar" }
      })

    })
    yield request(app).get("/foobar")
      .expect(500, {})
  })

})
