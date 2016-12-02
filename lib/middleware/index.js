module.exports = (app, apis) => app ? require("./routes")(app, apis) : require("./errors")
