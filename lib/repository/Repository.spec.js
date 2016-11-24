require("co-mocha")

const should = require("should")

const Repository = require("./Repository")

describe("Repository", () => {

  it("should not be instantiable", function *() {
    let instantiated = false
    try {
      new Repository()
      instantiated = true
    } catch (error) {
      error.should.be.an.instanceOf(TypeError)
      error.message.should.equal("Cannot instantiate Repository")
    } finally {
      instantiated.should.be.false()
    }
  })

})
