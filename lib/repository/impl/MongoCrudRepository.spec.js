require("co-mocha")
require("should")

const MongoCrudRepository = require("./MongoCrudRepository")

describe("MongoCrudRepository", () => {

  it("should not be directly instantiable", function *() {
    let instantiated = false
    try {
      new MongoCrudRepository()
      instantiated = true
    } catch (error) {
      error.should.be.an.instanceOf(TypeError)
      error.message.should.be.exactly("Cannot instantiate MongoCrudRepository directly")
    } finally {
      instantiated.should.be.exactly(false)
    }
  })

})
