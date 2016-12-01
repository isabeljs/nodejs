const extend = require("extend")

const Api = require("./Api")

module.exports = {
  api: extend(router => new Api(router), require("./response"), require("./path"), require("./mediaType"))
}
