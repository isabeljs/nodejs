const middleware = require("./middleware/")
const repository = require("./repository/")
const service = require("./service/")
const api = require("./api/")

module.exports = Object.assign(
  (app, ...apis) => middleware(app, apis),
  repository, service, api
)
