const routes = require("./routes")
const errors = require("./errors")

module.exports = (app, apis) => app ? routes(app, apis) : errors
