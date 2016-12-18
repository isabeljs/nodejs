const mediaTypes = require("./mediaTypes")
const MediaType = require("./MediaType")
const hal = require("./impl/hal")

module.exports = {

  mediaTypes: Object.assign((...candidates) => mediaTypes.register(candidates), {
    clear: () => mediaTypes.clear(),
    MediaType,
    HAL: hal
  })

}
