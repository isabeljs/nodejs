const co = require("co")
const database = require("./database")

co(function*() {
  yield database.connect("mongodb://localhost:27017/blog")
  const articleService = require("./articleService")
  // let article = yield articleService.getById(...)
}).catch(console.log);
