require("co-mocha")
require("should")

const request = require('supertest')

const app = require("koa")()
const router = require("koa-router")()
const bodyParser = require("koa-bodyparser")
const mediaTypes = require("../").api.mediaTypes
const database = require("../examples/database")

describe("API", () => {

  let server = null

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
    server = app.use(bodyParser()).use(router.routes()).use(router.allowedMethods()).listen(3000)
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
        _id: article._id.toString(),
        title: article.title,
        content: article.content
      })
  })

  it("should fail when getting a nonexistent resource", function *() {
    yield request("http://localhost:3000")
      .get("/articles/000000000000000000000000")
      .set("Accept", "application/hal+json")
      .expect(404, {})
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
          _id: article1._id.toString(),
          title: article1.title,
          content: article1.content
        }, {
          _links: {
            self: `http://localhost:3000/articles/${article2._id}`
          },
          _id: article2._id.toString(),
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
    Object.keys(article).length.should.be.exactly(3)
    article.should.have.property("_id")
    article.title.should.be.exactly(newArticle.title)
    article.content.should.be.exactly(newArticle.content)
    response.body.should.eql({
      _links: {
        self: `http://localhost:3000/articles/${article._id}`
      },
      _id: article._id.toString(),
      title: article.title,
      content: article.content
    })
  })

  it("should replace a resource", function *() {
    const originalArticle = yield _createArticle()
    const update = {
      title: "Updated article title",
      description: "Updated article description",
      tags: ["foo", "bar"]
    }
    yield request("http://localhost:3000")
      .put(`/articles/${originalArticle._id}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/hal+json")
      .send(update)
      .expect(200, {
        _links: {
          self: `http://localhost:3000/articles/${originalArticle._id}`
        },
        _id: originalArticle._id.toString(),
        title: update.title,
        description: update.description,
        tags: update.tags
      })
    const currentArticles = yield database.collection("articles").find().toArray()
    currentArticles.length.should.be.exactly(1)
    const currentArticle = currentArticles[0]
    Object.keys(currentArticle).length.should.be.exactly(4)
    currentArticle._id.toString().should.be.exactly(originalArticle._id.toString())
    currentArticle.title.should.be.exactly(update.title)
    currentArticle.description.should.be.exactly(update.description)
    currentArticle.tags.should.eql(update.tags)
  })

  it("should fail when replacing a nonexistent resource", function *() {
    const update = {
      title: "Updated article title",
      description: "Updated article description",
      tags: ["foo", "bar"]
    }
    yield request("http://localhost:3000")
      .put("/articles/000000000000000000000000")
      .set("Content-Type", "application/json")
      .set("Accept", "application/hal+json")
      .send(update)
      .expect(404, {})
  })

  it("should update a resource", function *() {
    const originalArticle = yield _createArticle()
    const update = {
      title: "Updated article title",
      description: "Updated article description",
      tags: ["foo", "bar"]
    }
    yield request("http://localhost:3000")
      .patch(`/articles/${originalArticle._id}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/hal+json")
      .send(update)
      .expect(200, {
        _links: {
          self: `http://localhost:3000/articles/${originalArticle._id}`
        },
        _id: originalArticle._id.toString(),
        title: update.title,
        content: originalArticle.content,
        description: update.description,
        tags: update.tags
      })
    const currentArticles = yield database.collection("articles").find().toArray()
    currentArticles.length.should.be.exactly(1)
    const currentArticle = currentArticles[0]
    Object.keys(currentArticle).length.should.be.exactly(5)
    currentArticle._id.toString().should.be.exactly(originalArticle._id.toString())
    currentArticle.title.should.be.exactly(update.title)
    currentArticle.content.should.be.exactly(originalArticle.content)
    currentArticle.description.should.be.exactly(update.description)
    currentArticle.tags.should.eql(update.tags)
  })

  it("should fail when updating a nonexistent resource", function *() {
    const update = {
      title: "Updated article title",
      description: "Updated article description",
      tags: ["foo", "bar"]
    }
    yield request("http://localhost:3000")
      .patch("/articles/000000000000000000000000")
      .set("Content-Type", "application/json")
      .set("Accept", "application/hal+json")
      .send(update)
      .expect(404, {})
  })

  it("should delete a resource", function *() {
    const article = yield _createArticle()
    yield request("http://localhost:3000")
      .delete(`/articles/${article._id}`)
      .set("Accept", "application/hal+json")
      .expect(204)
    const currentArticles = yield database.collection("articles").find().toArray()
    currentArticles.length.should.be.exactly(0)
  })

  it("should fail when deleting a nonexistent resource", function *() {
    yield request("http://localhost:3000")
      .delete("/articles/000000000000000000000000")
      .set("Accept", "application/hal+json")
      .expect(404)
  })

  afterEach(function *() {
    yield database.collection("articles").deleteMany()
  })

  after(function *() {
    server.close()
  })

})
