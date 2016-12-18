const Api = require("./Api")
const response = require("./response")
const path = require("./path")
const mediaType = require("./mediaType/")

module.exports = {
  api: Object.assign(router => new Api(router), response, path, mediaType)
}
