const api = require("../../").api
const articleResource = require("./articleResource")
const articleService = require("./articleService")

module.exports = router => {

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

    .get(articleResource.paths.articles, function *getArticles() {
      const articles = yield articleService.list()
      return api.ok(articles.map(article => articleResource.fromMongo(article)))
        .forEach((resource, article) => resource.link("self", articleResource.paths.article(article.id)))
        .link("self", articleResource.paths.articles())
    })

}
