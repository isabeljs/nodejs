const extend = require("extend")
const mediaTypes = require("./mediaType/mediaTypes")

module.exports = {

  mediaTypes: extend(function () {
    mediaTypes.register.apply(mediaTypes, arguments)
  }, {
    clear: () => mediaTypes.clear(),
    MediaType: require("./mediaType/MediaType")
  }, {
    HAL: require("./mediaType/impl/hal")
  })

}
