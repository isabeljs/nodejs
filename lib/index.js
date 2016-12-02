const extend = require("extend")

const middleware = require("./middleware/")

module.exports = extend(
  function (app) {
    return middleware.call(null, app, Array.prototype.slice.call(arguments, 1))
  },
  require("./repository/"),
  require("./service/"),
  require("./api/")
)
