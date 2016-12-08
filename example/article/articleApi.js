const { api } = require("../../")
const articlePaths = require("./articlePaths")
const articleService = require("./articleService")

module.exports = router => api(router)

  .get(articlePaths.article, function *getArticle() {
    const article = yield articleService.findOneById(this.params.id)
    return !article ? api.notFound() : api.ok(article)
      .link("self", articlePaths.article(this.params.id))
  })

  .get(articlePaths.articles, function *getArticles() {
    const articles = yield articleService.findMany()
    return api.ok(articles)
      .forEach((resource, article) => resource.link("self", articlePaths.article(article._id)))
      .link("self", articlePaths.articles())
  })

  .post(articlePaths.articles, function *createArticle() {
    const article = yield articleService.insertOne(this.request.body)
    return api.created(article)
      .link("self", articlePaths.article(article._id))
  })

  .put(articlePaths.article, function *replaceArticle() {
    const article = yield articleService.replaceOneById(this.params.id, this.request.body)
    return !article ? api.notFound() : api.ok(article)
      .link("self", articlePaths.article(this.params.id))
  })

  .patch(articlePaths.article, function *updateArticle() {
    const article = yield articleService.updateOneById(this.params.id, this.request.body)
    return !article ? api.notFound() : api.ok(article)
      .link("self", articlePaths.article(this.params.id))
  })

  .delete(articlePaths.article, function *deleteArticle() {
    const deletedArticleId = yield articleService.deleteOneById(this.params.id, false)
    return !deletedArticleId ? api.notFound() : api.noContent()
  })

  .delete(articlePaths.articles, function *deleteArticles() {
    yield articleService.deleteMany()
    return api.noContent()
  })
