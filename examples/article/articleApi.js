const api = require("../../").api
const articleResource = require("./articleResource")
const articleService = require("./articleService")

module.exports = function articleApi(router) {

  api(router)

    .get(articleResource.paths.article, function *getArticle() {
      const article = yield articleService.getById(this.params.id)
      if (!article) {
        return api.notFound()
      } else {
        return api.ok(articleResource.fromMongo(article))
          .link("self", articleResource.paths.article(this.params.id))
      }
    })

}
