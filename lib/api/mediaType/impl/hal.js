const extend = require("extend")
const MediaType = require("../MediaType")

module.exports = new class Hal extends MediaType {

  constructor() {
    super("application/hal+json")
  }

  buildLinks(response, baseUrl) {
    const links = {}
    response.links.forEach((path, rel) => links[rel] = `${baseUrl}${path}`)
    return { _links: links }
  }

  buildPayload(response, baseUrl) {
    let payload = response.payload
    if (response.iterable) {
      payload = {
        _embedded: payload.map(resource => extend(
          this.buildLinks(resource, baseUrl),
          resource.payload
        ))
      }
    }
    return payload
  }

  convert(context, response) {
    const baseUrl = MediaType.getBaseUrl(context)
    context.status = response.status
    context.body = extend(
      this.buildLinks(response, baseUrl),
      this.buildPayload(response, baseUrl)
    )
  }

}
