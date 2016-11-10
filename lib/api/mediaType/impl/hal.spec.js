require("co-mocha")

const expect = require("chai").expect
const request = require('supertest')

const app = require("koa")()
const router = require("koa-router")()
const mediaTypes = require("app-root-path").require("/").api.mediaTypes
const database = require("app-root-path").require("/examples/database")

describe("HAL", () => {

  const _createArticle = function *() {
    const article = {
      title: Math.random().toString(36),
      content: Math.random().toString(36)
    }
    yield database.collection("articles").insertOne(article)
    return article
  }

  before(function *() {
    yield database.connect("mongodb://localhost:27017/ron")
    mediaTypes(mediaTypes.HAL)
    require("app-root-path").require("/examples/article/articleApi")(router)
    app.use(router.routes()).use(router.allowedMethods()).listen(3000)
  })

  it("should format single document", function *() {
    const article = yield _createArticle()
    yield request("http://localhost:3000")
      .get(`/articles/${article._id}`)
      .set("Accept", "application/hal+json")
      .expect("Content-Type", "application/hal+json")
      .expect(200, {
        id: article._id.toString(),
        title: article.title,
        content: article.content,
        _links: {
          self: `http://localhost:3000/articles/${article._id}`
        }
      })
  })

  afterEach(function *() {
    yield database.collection("articles").deleteMany()
  })

})
