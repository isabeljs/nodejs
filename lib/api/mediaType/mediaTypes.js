const accepts = require("accepts")
const MediaType = require("./MediaType")
const hal = require("./impl/hal")

module.exports = new class MediaTypes {

  constructor() {
    this.mediaTypesByNames = new Map
  }

  register() {
    for (const mediaType of arguments) {
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
      throw {
        status: 406,
        payload: {
          message: "None of the supported media-types matched the Accept header",
          acceptHeader: context.request.get("Accept"),
          supportedMediaTypes: mediaTypesNames
        }
      }
    }
    return acceptedMediaType
  }

  convert(context, response) {
    const acceptedMediaType = this.findAcceptedMediaType(context)
    this.mediaTypesByNames.get(acceptedMediaType).convert(context, response)
    return acceptedMediaType
  }

}
