require("co-mocha")

const should = require("should")

const response = require("./response")

describe("response", () => {

  const _checkResponseStatus = function (statusName, status) {
    const resource = { foo: "bar" }
    const created = response[statusName](resource)
    created.should.be.an.instanceOf(response.Resource)
    created.should.be.an.instanceOf(response.Response)
    created.iterable.should.be.false()
    created.payload.should.equal(resource)
    created.status.should.equal(status)
  }

  it("should provide aliases for common success statuses", function *() {
    _checkResponseStatus("ok", 200)
    _checkResponseStatus("created", 201)
    _checkResponseStatus("accepted", 202)
    _checkResponseStatus("noContent", 204)
  })

  it("should provide aliases for common client errors statuses", function *() {
    _checkResponseStatus("badRequest", 400)
    _checkResponseStatus("unauthorized", 401)
    _checkResponseStatus("forbidden", 403)
    _checkResponseStatus("notFound", 404)
    _checkResponseStatus("conflict", 409)
    _checkResponseStatus("gone", 410)
    _checkResponseStatus("unprocessableEntity", 422)
    _checkResponseStatus("locked", 423)
    _checkResponseStatus("failedDependency", 424)
    _checkResponseStatus("tooManyRequests", 429)
  })

  it("should provide aliases for common server errors statuses", function *() {
    _checkResponseStatus("internalServerError", 500)
    _checkResponseStatus("notImplemented", 501)
    _checkResponseStatus("serviceUnavailable", 503)
    _checkResponseStatus("insufficientStorage", 507)
  })

  it("should handle collections of resources", function *() {
    const resources = [
      { value: "v1" },
      { value: "v2" }
    ]
    const created = new response.Response(200, resources)
    created.should.be.an.instanceOf(response.Resource)
    created.iterable.should.be.true()
    let i = 0
    created.forEach((resource, payload) => {
      resource.should.be.instanceOf(response.Resource)
      resource.iterable.should.be.false()
      payload.should.equal(resources[i++])
    }).should.equal(created)
  })

  it("should fail when trying to iterate a single resource", function *() {
    const created = new response.Resource(200, { foo: "bar" })
    let iterated = false
    try {
      created.forEach(() => {})
      iterated = true
    } catch (error) {
      error.should.be.an.instanceOf(Error)
      error.message.should.equal("Response doesn't contain iterable resources")
    } finally {
      iterated.should.be.false()
    }
  })

  it("should handle links", function *() {
    const created = new response.Resource(200, { foo: "bar" })
    created.link("foo1", "bar1").should.equal(created)
    created.link("foo2", "bar2").should.equal(created)
    created.links.get("foo1").should.equal("bar1")
    created.links.get("foo2").should.equal("bar2")
  })

})
