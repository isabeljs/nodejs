const api = require("../../").api
const articlePaths = require("./articlePaths")
const articleService = require("./articleService")

module.exports = router => {

  api(router)

    .get(articlePaths.article, function *findArticle() {
      const article = yield articleService.findOneById(this.params.id)
      if (!article) {
        return api.notFound()
      } else {
        return api.ok(article)
          .link("self", articlePaths.article(this.params.id))
      }
    })

    .get(articlePaths.articles, function *findArticles() {
      const articles = yield articleService.find()
      return api.ok(articles)
        .forEach((resource, article) => resource.link("self", articlePaths.article(article._id)))
        .link("self", articlePaths.articles())
    })

    .post(articlePaths.articles, function *insertArticle() {
      const article = yield articleService.insertOne(this.request.body)
      return api.created(article)
        .link("self", articlePaths.article(article._id))
    })

    .put(articlePaths.article, function *replaceArticle() {
      const article = yield articleService.replaceOneById(this.params.id, this.request.body)
      if (!article) {
        return api.notFound()
      } else {
        return api.ok(article)
          .link("self", articlePaths.article(this.params.id))
      }
    })

    .patch(articlePaths.article, function *updateArticle() {
      const article = yield articleService.updateOneById(this.params.id, this.request.body)
      if (!article) {
        return api.notFound()
      } else {
        return api.ok(article)
          .link("self", articlePaths.article(this.params.id))
      }
    })

}
