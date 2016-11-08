const accepts = require("accepts")
const MediaType = require("./MediaType")
const hal = require("./impl/hal")

module.exports = new class MediaTypes {

  constructor() {
    this.mediaTypesByNames = {}
  }

  register(mediaTypes) {
    for (const mediaType of mediaTypes) {
      if (!(mediaType instanceof MediaType)) {
        throw new TypeError("Supported media-types must be instances of MediaType")
      }
      this.mediaTypesByNames[mediaType.name] = mediaType
    }
  }

  findAcceptedMediaType(context) {
    const mediaTypesNames = Object.keys(this.mediaTypesByNames)
    const acceptedMediaType = accepts(context.request).types(mediaTypesNames)
    if (!acceptedMediaType) {
      throw {
        message: "None of the supported media-types matched the Accept header",
        acceptHeader: context.request.get("Accept"),
        supportedMediaTypes: mediaTypesNames
      }
    }
    return acceptedMediaType
  }

  convert(context, response) {
    const acceptedMediaType = this.findAcceptedMediaType(context)
    this.mediaTypesByNames[acceptedMediaType].convert(context, response)
    return acceptedMediaType
  }

}()
