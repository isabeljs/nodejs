class Resource {

  constructor(payload) {
    this.payload = payload
    this.links = {}
  }

  link(rel, url) {
    this.links[rel] = url
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
