const MediaType = require("../MediaType")

module.exports = new class Hal extends MediaType {

  constructor() {
    super("application/hal+json")
  }

  represent(resource, baseUrl) { // eslint-disable-line class-methods-use-this
    return Object.assign(
      Hal.buildLinks(resource, baseUrl),
      Hal.buildPayload(resource, baseUrl)
    )
  }

  static buildLinks(resource, baseUrl) {
    const links = {}
    resource.links.forEach((path, rel) => links[rel] = `${baseUrl}${path}`)
    return Object.keys(links).length === 0 ? {} : { _links: links }
  }

  static buildPayload(resource, baseUrl) {
    let payload = resource.payload
    if (resource.iterable) {
      payload = {
        _embedded: payload.map(subResource => Object.assign(
          Hal.buildLinks(subResource, baseUrl),
          subResource.payload
        ))
      }
    }
    return payload
  }

}
