require("co-mocha")
require("should")

const request = require('supertest')

const app = require("koa")()
const router = require("koa-router")()
const bodyParser = require("koa-bodyparser")
const mediaTypes = require("../").api.mediaTypes
const database = require("../examples/database")

describe("API", () => {

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
    require("../examples/article/articleApi")(router)
    app.use(bodyParser()).use(router.routes()).use(router.allowedMethods()).listen(3000)
  })

  it("should get a resource", function *() {
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

  it("should list resources", function *() {
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
          _links: {
            self: `http://localhost:3000/articles/${article1._id}`
          },
          id: article1._id.toString(),
          title: article1.title,
          content: article1.content
        }, {
          _links: {
            self: `http://localhost:3000/articles/${article2._id}`
          },
          id: article2._id.toString(),
          title: article2.title,
          content: article2.content
        }]
      })
  })

  it("should create a resource", function *() {
    const newArticle = {
      title: "New article title",
      content: "New article content"
    }
    const response = yield request("http://localhost:3000")
      .post("/articles")
      .set("Content-Type", "application/json")
      .set("Accept", "application/hal+json")
      .send(newArticle)
      .expect(201)
    const articles = yield database.collection("articles").find().toArray()
    articles.length.should.be.exactly(1)
    const article = articles[0]
    article.title.should.be.exactly(newArticle.title)
    article.content.should.be.exactly(newArticle.content)
    response.body.should.eql({
      _links: {
        self: `http://localhost:3000/articles/${article._id}`
      },
      id: article._id.toString(),
      title: article.title,
      content: article.content
    })
  })

  afterEach(function *() {
    yield database.collection("articles").deleteMany()
  })

})
