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
        _links: {
          self: `http://localhost:3000/articles/${article._id}`
        },
        id: article._id.toString(),
        title: article.title,
        content: article.content
      })
  })

  it("should format multiple documents", function *() {
    const article1 = yield _createArticle()
    const article2 = yield _createArticle()
    yield request("http://localhost:3000")
      .get("/articles")
      .set("Accept", "application/hal+json")
      .expect(200, {
        _links: {
          self: "http://localhost:3000/articles"
        },
        _embedded: [{
          id: article1._id.toString(),
          title: article1.title,
          content: article1.content,
          _links: {
            self: `http://localhost:3000/articles/${article1._id}`
          }
        }, {
          id: article2._id.toString(),
          title: article2.title,
          content: article2.content,
          _links: {
            self: `http://localhost:3000/articles/${article2._id}`
          }
        }]
      })
  })

  afterEach(function *() {
    yield database.collection("articles").deleteMany()
  })

})
