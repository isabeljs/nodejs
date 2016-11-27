require("co-mocha")

const should = require("should")

const path = require("./path")

describe("path", () => {

  it("should keep the original path accessible", () => {
    const created = path.path("/foo/bar")
    created.should.be.an.instanceOf(Function)
    created.path.should.equal("/foo/bar")
  })

  it("should resolve path variables", () => {
    path.path("/foo/:fooBar1/bar/:fooBar2")().should.equal("/foo/:fooBar1/bar/:fooBar2")
    path.path("/foo/:fooBar1/bar/:fooBar2")("1").should.equal("/foo/1/bar/:fooBar2")
    path.path("/foo/:fooBar1/bar/:fooBar2")("1", 2).should.equal("/foo/1/bar/2")
    path.path("/foo/:fooBar1/bar/:fooBar2")("1", 2, 3).should.equal("/foo/1/bar/2")
  })

})
