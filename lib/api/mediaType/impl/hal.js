const extend = require("extend")
const MediaType = require("../MediaType")

module.exports = new class Hal extends MediaType {

  constructor() {
    super("application/hal+json")
  }

  convert(context, response) {
    const baseUrl = MediaType.getBaseUrl(context)
    const links = {}
    response.links.forEach((path, rel) => links[rel] = `${baseUrl}${path}`)
    context.status = response.status
    context.body = extend(links, response.payload)
  }

}
