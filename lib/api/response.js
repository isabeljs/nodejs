class Resource {

  constructor(payload) {
    this.iterable = payload && typeof payload[Symbol.iterator] === "function"
    this.payload = this.iterable ? Array.from(payload).map(resource => new Resource(resource)) : payload
    this.links = new Map
  }

  forEach(callback) {
    if (!this.iterable) {
      throw new Error("Response doesn't contain iterable resources")
    }
    this.payload.forEach(resource => callback.call(null, resource, resource.payload))
    return this
  }

  link(rel, url) {
    this.links.set(rel, url)
    return this
  }

}

class Response extends Resource {

  constructor(status, payload) {
    super(payload)
    this.status = status
  }

}

module.exports = {

  Resource: Resource,
  Response: Response,

  ok: payload => new Response(200, payload),
  created: payload => new Response(201, payload),
  accepted: payload => new Response(202, payload),
  noContent: payload => new Response(204, payload),

  badRequest: payload => new Response(400, payload),
  unauthorized: payload => new Response(401, payload),
  forbidden: payload => new Response(403, payload),
  notFound: payload => new Response(404, payload),
  conflict: payload => new Response(409, payload),
  gone: payload => new Response(410, payload),
  unprocessableEntity: payload => new Response(422, payload),
  locked: payload => new Response(423, payload),
  failedDependency: payload => new Response(424, payload),
  tooManyRequests: payload => new Response(429, payload),

  internalServerError: payload => new Response(500, payload),
  notImplemented: payload => new Response(501, payload),
  serviceUnavailable: payload => new Response(503, payload),
  insufficientStorage: payload => new Response(507, payload)

}
