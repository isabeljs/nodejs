const extend = require("extend")

const middleware = require("./middleware/")
const repository = require("./repository/")
const service = require("./service/")
const api = require("./api/")

module.exports = extend(
  (app, ...apis) => middleware(app, apis),
  repository, service, api
)
