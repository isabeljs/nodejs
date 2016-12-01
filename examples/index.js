const co = require("co")
const app = require("koa")()
const router = require("koa-router")()
const bodyParser = require("koa-bodyparser")
const ron = require("../")
const mediaTypes = ron.api.mediaTypes

const database = require("./database")

co(function *() {

  // connect to database
  yield database.connect("mongodb://localhost:27017/blog")

  // register media-types
  mediaTypes(mediaTypes.HAL)

  // register APIs
  require("./article/articleApi")(router)

  // bootstrap
  app.use(ron()).use(bodyParser()).use(router.routes()).use(router.allowedMethods()).listen(3000)

}).catch(error => {
  console.error(error.stack)
})
