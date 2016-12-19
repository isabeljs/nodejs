/* eslint-disable func-names, require-yield, max-statements, no-magic-numbers */

require("co-mocha")

const should = require("should") // eslint-disable-line no-unused-vars

const MediaType = require("./MediaType")

describe("MediaType", () => {

  const ACTUAL_METHODS = Object.getOwnPropertyNames(MediaType.prototype).filter(method => method !== "constructor")

  const _checkThatConversionsMethodsImplementationsAreNeeded = (mediaType, mediaTypeName) => {
    for (const method of ACTUAL_METHODS) {
      let called = false
      try {
        mediaType[method]()
        called = true
      } catch (error) {
        error.should.be.an.instanceOf(TypeError)
        error.message.should.equal(`MediaType.${method}(...) needs to be overridden by ${mediaTypeName}`)
      } finally {
        called.should.be.false()
      }
    }
  }

  it("should not be instantiable", () => {
    let instantiated = false
    try {
      new MediaType() // eslint-disable-line no-new
      instantiated = true
    } catch (error) {
      error.should.be.an.instanceOf(TypeError)
      error.message.should.equal("Cannot instantiate MediaType")
    } finally {
      instantiated.should.be.false()
    }
  })

  it("should provide only expected conversion methods", () => {
    const expectedMethods = [
      "represent"
    ]
    const forgottenExpectedMethods = expectedMethods.filter(method => ACTUAL_METHODS.indexOf(method) < 0)
    forgottenExpectedMethods.should.be.empty()
    const additionalActualMethods = ACTUAL_METHODS.filter(method => expectedMethods.indexOf(method) < 0)
    additionalActualMethods.should.be.empty()
  })

  it("should force subclasses to implement expected conversion methods", () => {
    _checkThatConversionsMethodsImplementationsAreNeeded(new class MyMediaType extends MediaType {}, "MyMediaType")
    _checkThatConversionsMethodsImplementationsAreNeeded(new class extends MediaType {}, "anonymous subclass")
  })

})
