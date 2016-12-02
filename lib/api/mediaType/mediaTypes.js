const accepts = require("accepts")
const MediaType = require("./MediaType")
const hal = require("./impl/hal")

module.exports = new class MediaTypes {

  constructor() {
    this.mediaTypesByNames = new Map
  }

  register(mediaTypes) {
    for (const mediaType of mediaTypes) {
      if (!(mediaType instanceof MediaType)) {
        throw new TypeError("Supported media-types must be instances of MediaType")
      }
      this.mediaTypesByNames.set(mediaType.name, mediaType)
    }
  }

  clear() {
    this.mediaTypesByNames.clear()
  }

  findAcceptedMediaType(context) {
    if (this.mediaTypesByNames.size === 0) {
      throw new Error("You must register at least one media-type")
    }
    const mediaTypesNames = Array.from(this.mediaTypesByNames.keys())
    const acceptedMediaType = accepts(context.request).types(mediaTypesNames)
    if (!acceptedMediaType) {
      context.throw(406, `None of the supported media-types ['${mediaTypesNames.join("', '")}'] matched the Accept header '${context.request.get("Accept")}'`)
    }
    return acceptedMediaType
  }

  represent(context, response) {
    const acceptedMediaType = this.findAcceptedMediaType(context)
    const baseUrl = `${context.request.protocol}://${context.request.get("Host")}`
    context.body = this.mediaTypesByNames.get(acceptedMediaType).represent(response, baseUrl)
    context.status = response.status
    context.response.set("Content-Type", acceptedMediaType)
  }

}
