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
        _embedded: payload.map(subResource => Object.assign(
          this.buildLinks(subResource, baseUrl),
          subResource.payload
        ))
      }
    }
    return payload
  }

  represent(resource, baseUrl) {
    return Object.assign(
      this.buildLinks(resource, baseUrl),
      this.buildPayload(resource, baseUrl)
    )
  }

}
