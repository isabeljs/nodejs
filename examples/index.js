const co = require("co")
const app = require("koa")()
const router = require("koa-router")()
const database = require("./database")

co(function *() {
  yield database.connect("mongodb://localhost:27017/blog")
  require("./article/")(router)
  app.use(router.routes()).use(router.allowedMethods()).listen(3000)
}).catch((error) => {
  console.log(error.stack)
})
