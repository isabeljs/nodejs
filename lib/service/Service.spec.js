/* eslint-disable func-names, require-yield, max-statements, no-magic-numbers */

require("co-mocha")

const should = require("should") // eslint-disable-line no-unused-vars

const Service = require("./Service")

describe("Service", () => {

  it("should not be instantiable", () => {
    let instantiated = false
    try {
      new Service() // eslint-disable-line no-new
      instantiated = true
    } catch (error) {
      error.should.be.an.instanceOf(TypeError)
      error.message.should.equal("Cannot instantiate Service")
    } finally {
      instantiated.should.be.false()
    }
  })

})
