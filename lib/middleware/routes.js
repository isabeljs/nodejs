const bodyParser = require("koa-bodyparser")

const Api = require("../api/Api")

module.exports = (app, apis = []) => {

  const routers = new Set
  for (const api of apis) {
    if (!(api instanceof Api)) {
      throw new TypeError("Middleware expects Api instances as arguments")
    }
    routers.add(api.router)
  }

  app.use(require("./errors")).use(bodyParser())
  for (const router of routers) {
    app.use(router.routes()).use(router.allowedMethods())
  }

  return require("./noop")

}
