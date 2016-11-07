const extend = require("extend")

module.exports = {
  api: extend(require("./api"), require("./response"), {
    mediaTypesHolder: require("./mediaType/mediaTypesHolder"),
    MediaType: require("./mediaType/MediaType")
  })
}
