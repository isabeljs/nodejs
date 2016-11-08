const extend = require("extend")
const api = require("./api")

module.exports = {
  api: extend(router => api(router), require("./response"), require("./path"), require("./mediaType"))
}
