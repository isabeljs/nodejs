const extend = require("extend")

const mediaTypes = require("./mediaTypes")

module.exports = {

  mediaTypes: extend(function () {
    mediaTypes.register.apply(mediaTypes, arguments)
  }, {
    clear: () => mediaTypes.clear(),
    MediaType: require("./MediaType"),
    HAL: require("./impl/hal")
  })

}
