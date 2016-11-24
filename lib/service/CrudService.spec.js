require("co-mocha")

const should = require("should")
const sinon = require("sinon")

const CrudService = require("./CrudService")

describe("CrudService", () => {

  it("should not be instantiable", function *() {
    let instantiated = false
    try {
      new CrudService()
      instantiated = true
    } catch (error) {
      error.should.be.an.instanceOf(TypeError)
      error.message.should.equal("Cannot instantiate CrudService")
    } finally {
      instantiated.should.be.false()
    }
  })

  it("should not accept an argument that is not an instance of CrudRepository", function *() {
    let instantiated = false
    try {
      new class extends CrudService {

        constructor() {
          super()
        }

      }
      instantiated = true
    } catch (error) {
      error.should.be.an.instanceOf(TypeError)
      error.message.should.equal("repository must be an instance of CrudRepository")
    } finally {
      instantiated.should.be.false()
    }
  })

})
