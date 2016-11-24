require("co-mocha")

const should = require("should")

const Service = require("./Service")

describe("Service", () => {

  it("should not be instantiable", function *() {
    let instantiated = false
    try {
      new Service()
      instantiated = true
    } catch (error) {
      error.should.be.an.instanceOf(TypeError)
      error.message.should.equal("Cannot instantiate Service")
    } finally {
      instantiated.should.be.false()
    }
  })

})
