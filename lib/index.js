const extend = require("extend")

const middleware = require("./middleware/")

module.exports = extend(
  () => middleware,
  require("./repository/"),
  require("./service/"),
  require("./api/")
)
