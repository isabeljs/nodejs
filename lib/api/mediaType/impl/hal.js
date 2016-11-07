const extend = require("extend")
const MediaType = require("../MediaType")

module.exports = new class Hal extends MediaType {

  constructor() {
    super("application/hal+json")
  }

  convert(context, response) {
    context.status = response.status
    context.body = extend({ _links: response.links }, response.payload)
  }

}()
