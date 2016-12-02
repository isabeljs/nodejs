const extend = require("extend")

const Api = require("./Api")
const response = require("./response")
const path = require("./path")
const mediaType = require("./mediaType/")

module.exports = {
  api: extend(router => new Api(router), response, path, mediaType)
}
