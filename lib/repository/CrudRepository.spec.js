/* eslint-disable func-names, require-yield, max-statements, no-magic-numbers */

require("co-mocha")

const should = require("should") // eslint-disable-line no-unused-vars

const CrudRepository = require("./CrudRepository")

describe("CrudRepository", () => {

  const ACTUAL_METHODS = Object.getOwnPropertyNames(CrudRepository.prototype).filter(method => method !== "constructor")

  function *_checkThatCrudMethodsImplementationsAreNeeded(repository, repositoryName) {
    for (const method of ACTUAL_METHODS) {
      let called = false
      try {
        yield repository[method]()
        called = true
      } catch (error) {
        error.should.be.an.instanceOf(TypeError)
        error.message.should.equal(`CrudRepository.${method}(...) needs to be overridden by ${repositoryName}`)
      } finally {
        called.should.be.false()
      }
    }
  }

  it("should not be instantiable", () => {
    let instantiated = false
    try {
      new CrudRepository() // eslint-disable-line no-new
      instantiated = true
    } catch (error) {
      error.should.be.an.instanceOf(TypeError)
      error.message.should.equal("Cannot instantiate CrudRepository")
    } finally {
      instantiated.should.be.false()
    }
  })

  it("should provide only expected CRUD methods", () => {
    const expectedMethods = [
      "findOneById",
      "findMany",
      "insertOne",
      "replaceOneById",
      "updateOneById",
      "deleteOneById",
      "deleteMany"
    ]
    const forgottenExpectedMethods = expectedMethods.filter(method => ACTUAL_METHODS.indexOf(method) < 0)
    forgottenExpectedMethods.should.be.empty()
    const additionalActualMethods = ACTUAL_METHODS.filter(method => expectedMethods.indexOf(method) < 0)
    additionalActualMethods.should.be.empty()
  })

  it("should force subclasses to implement expected CRUD methods", function *() {
    yield _checkThatCrudMethodsImplementationsAreNeeded(new class MyRepository extends CrudRepository {}, "MyRepository")
    yield _checkThatCrudMethodsImplementationsAreNeeded(new class extends CrudRepository {}, "anonymous subclass")
  })

})
