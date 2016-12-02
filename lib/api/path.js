const extend = require("extend")

module.exports = {

  path: path => extend(
    (...values) => path.replace(/:[a-zA-Z0-9]+/g, variable => values.shift() || variable),
    { path }
  )

}
