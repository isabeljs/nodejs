require("co-mocha")

const should = require("should")

const CrudRepository = require("./CrudRepository")

describe("CrudRepository", () => {

  const actualMethods = Object.getOwnPropertyNames(CrudRepository.prototype).filter(method => method !== "constructor")

  it("should not be instantiable", function *() {
    let instantiated = false
    try {
      new CrudRepository()
      instantiated = true
    } catch (error) {
      error.should.be.an.instanceOf(TypeError)
      error.message.should.equal("Cannot instantiate CrudRepository")
    } finally {
      instantiated.should.be.false()
    }
  })

  it("should provide only expected CRUD methods", function *() {
    const expectedMethods = [
      "findOneById",
      "find",
      "insertOne",
      "replaceOneById",
      "updateOneById",
      "deleteOneById",
      "deleteMany"
    ]
    const forgottenExpectedMethods = expectedMethods.filter(method => actualMethods.indexOf(method) < 0)
    forgottenExpectedMethods.should.be.empty()
    const additionalActualMethods = actualMethods.filter(method => expectedMethods.indexOf(method) < 0)
    additionalActualMethods.should.be.empty()
  })

  it("should force subclasses to implement expected CRUD methods", function *() {
    const myRepository = new class MyRepository extends CrudRepository {}
    for (const method of actualMethods) {
      let called = false
      try {
        yield myRepository[method]()
        called = true
      } catch (error) {
        error.should.be.an.instanceOf(TypeError)
        error.message.should.equal(`CrudRepository.${method}(...) needs to be overridden by MyRepository`)
      } finally {
        called.should.be.false()
      }
    }
  })

})
