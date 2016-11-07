const accepts = require("accepts")
const hal = require("./impl/hal")

module.exports = new class MediaTypesHolder {

  constructor() {
    this.mediaTypesByNames = {}
    this.register(hal)
  }

  register(mediaType) {
    this.mediaTypesByNames[mediaType.name] = mediaType
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
