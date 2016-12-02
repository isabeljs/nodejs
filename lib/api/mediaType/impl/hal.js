const extend = require("extend")
const MediaType = require("../MediaType")

module.exports = new class Hal extends MediaType {

  constructor() {
    super("application/hal+json")
  }

  buildLinks(resource, baseUrl) {
    const links = {}
    resource.links.forEach((path, rel) => links[rel] = `${baseUrl}${path}`)
    return Object.keys(links).length === 0 ? {} : { _links: links }
  }

  buildPayload(resource, baseUrl) {
    let payload = resource.payload
    if (resource.iterable) {
      payload = {
        _embedded: payload.map(subResource => extend(
          this.buildLinks(subResource, baseUrl),
          subResource.payload
        ))
      }
    }
    return payload
  }

  convert(resource, baseUrl) {
    return extend(
      this.buildLinks(resource, baseUrl),
      this.buildPayload(resource, baseUrl)
    )
  }

}
