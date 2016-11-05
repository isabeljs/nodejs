const extend = require("extend")

module.exports = extend({},
  require("./repository/"),
  require("./service/")
)
