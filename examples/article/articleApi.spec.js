require("co-mocha")

const should = require("should")
const request = require("supertest")

const app = require("koa")()
const router = require("koa-router")()
const bodyParser = require("koa-bodyparser")

const ron = require("../../")
const mediaTypes = ron.api.mediaTypes
const database = require("../database")

describe("articleApi", () => {

  let _server = null
  let _articlesCollection = null

  const _createArticle = function *() {
    const article = {
      title: Math.random().toString(36),
      content: Math.random().toString(36)
    }
    yield _articlesCollection.insertOne(article)
    return article
  }

  const _checkResponseHasNoHeaders = (response, headers) => {
    const actualHeaders = Object.keys(response.headers).map(header => header.toLowerCase())
    headers.filter(header => actualHeaders.indexOf(header.toLowerCase()) >= 0).length.should.equal(0)
  }

  before(function *() {
    yield database.connect("mongodb://localhost:27017/ron")
    _articlesCollection = database.collection("articles")
    mediaTypes(mediaTypes.HAL)
    _server = app.use(ron(app,
      require("./articleApi")(router)
    )).listen(3000)
  })

  before(function *() {
    yield _articlesCollection.deleteMany()
  })

  it("should respond to OPTIONS requests targeting one resource", function *() {
    const response = yield request("http://localhost:3000")
      .options("/articles/000000000000000000000000")
      .expect(204)
    const allowHeader = response.get("Allow")
    allowHeader.should.match(/\bGET\b/)
    allowHeader.should.not.match(/\bPOST\b/)
    allowHeader.should.match(/\bPUT\b/)
    allowHeader.should.match(/\bPATCH\b/)
    allowHeader.should.match(/\bDELETE\b/)
  })

  it("should respond to OPTIONS requests targeting a collection of resources", function *() {
    const response = yield request("http://localhost:3000")
      .options("/articles")
      .expect(204)
    const allowHeader = response.get("Allow")
    allowHeader.should.match(/\bGET\b/)
    allowHeader.should.match(/\bPOST\b/)
    allowHeader.should.not.match(/\bPUT\b/)
    allowHeader.should.not.match(/\bPATCH\b/)
    allowHeader.should.match(/\bDELETE\b/)
  })

  it("should find a resource", function *() {
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

  it("should fail when finding a nonexistent resource", function *() {
    const response = yield request("http://localhost:3000")
      .get("/articles/000000000000000000000000")
      .set("Accept", "application/hal+json")
      .expect(404, "")
    _checkResponseHasNoHeaders(response, ["Content-Type", "Content-Length"])
  })

  it("should find resources", function *() {
    const article1 = yield _createArticle()
    const article2 = yield _createArticle()
    const response = yield request("http://localhost:3000")
      .get("/articles")
      .set("Accept", "application/hal+json")
      .expect("Content-Type", "application/hal+json")
      .expect(200)
    response.body.should.have.a.property("_links")
    response.body.should.have.a.property("_embedded")
    response.body._links.should.eql({
      self: "http://localhost:3000/articles"
    })
    response.body._embedded.should.be.an.Array().and.have.a.length(2)
    response.body._embedded.should.containEql({
      _links: {
        self: `http://localhost:3000/articles/${article1._id}`
      },
      _id: article1._id.toString(),
      title: article1.title,
      content: article1.content
    })
    response.body._embedded.should.containEql({
      _links: {
        self: `http://localhost:3000/articles/${article2._id}`
      },
      _id: article2._id.toString(),
      title: article2.title,
      content: article2.content
    })
  })

  it("should insert a resource", function *() {
    const insert = {
      title: "New article title",
      content: "New article content"
    }
    const response = yield request("http://localhost:3000")
      .post("/articles")
      .set("Content-Type", "application/json")
      .set("Accept", "application/hal+json")
      .send(insert)
      .expect("Content-Type", "application/hal+json")
      .expect(201)
    const articles = yield _articlesCollection.find().toArray()
    articles.should.have.length(1)
    const article = articles[0]
    Object.keys(article).should.have.a.length(3)
    article.should.have.a.property("_id").which.is.an.Object()
    article.title.should.equal(insert.title)
    article.content.should.equal(insert.content)
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
    const article = yield _createArticle()
    const replace = {
      title: "Updated article title",
      description: "Updated article description",
      tags: ["foo", "bar"]
    }
    yield request("http://localhost:3000")
      .put(`/articles/${article._id}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/hal+json")
      .send(replace)
      .expect("Content-Type", "application/hal+json")
      .expect(200, {
        _links: {
          self: `http://localhost:3000/articles/${article._id}`
        },
        _id: article._id.toString(),
        title: replace.title,
        description: replace.description,
        tags: replace.tags
      })
    const articles = yield _articlesCollection.find().toArray()
    articles.should.eql([{
      _id: article._id,
      title: replace.title,
      description: replace.description,
      tags: replace.tags
    }])
  })

  it("should fail when replacing a nonexistent resource", function *() {
    const replace = {
      title: "Updated article title",
      description: "Updated article description",
      tags: ["foo", "bar"]
    }
    const response = yield request("http://localhost:3000")
      .put("/articles/000000000000000000000000")
      .set("Content-Type", "application/json")
      .set("Accept", "application/hal+json")
      .send(replace)
      .expect(404, "")
    _checkResponseHasNoHeaders(response, ["Content-Type", "Content-Length"])
  })

  it("should update a resource", function *() {
    const article = yield _createArticle()
    const update = {
      title: "Updated article title",
      description: "Updated article description",
      tags: ["foo", "bar"]
    }
    yield request("http://localhost:3000")
      .patch(`/articles/${article._id}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/hal+json")
      .send(update)
      .expect("Content-Type", "application/hal+json")
      .expect(200, {
        _links: {
          self: `http://localhost:3000/articles/${article._id}`
        },
        _id: article._id.toString(),
        title: update.title,
        content: article.content,
        description: update.description,
        tags: update.tags
      })
    const articles = yield _articlesCollection.find().toArray()
    articles.should.eql([{
      _id: article._id,
      title: update.title,
      content: article.content,
      description: update.description,
      tags: update.tags
    }])
  })

  it("should fail when updating a nonexistent resource", function *() {
    const update = {
      title: "Updated article title",
      description: "Updated article description",
      tags: ["foo", "bar"]
    }
    const response = yield request("http://localhost:3000")
      .patch("/articles/000000000000000000000000")
      .set("Content-Type", "application/json")
      .set("Accept", "application/hal+json")
      .send(update)
      .expect(404, "")
    _checkResponseHasNoHeaders(response, ["Content-Type", "Content-Length"])
  })

  it("should delete a resource", function *() {
    const article = yield _createArticle()
    const response = yield request("http://localhost:3000")
      .delete(`/articles/${article._id}`)
      .set("Accept", "application/hal+json")
      .expect(204, "")
    _checkResponseHasNoHeaders(response, ["Content-Type", "Content-Length"])
    const articles = yield _articlesCollection.find().toArray()
    articles.should.be.empty()
  })

  it("should fail when deleting a nonexistent resource", function *() {
    const response = yield request("http://localhost:3000")
      .delete("/articles/000000000000000000000000")
      .set("Accept", "application/hal+json")
      .expect(404, "")
    _checkResponseHasNoHeaders(response, ["Content-Type", "Content-Length"])
  })

  it("should delete resources", function *() {
    yield _createArticle()
    yield _createArticle()
    const response = yield request("http://localhost:3000")
      .delete("/articles")
      .set("Accept", "application/hal+json")
      .expect(204, "")
    _checkResponseHasNoHeaders(response, ["Content-Type", "Content-Length"])
    const articles = yield _articlesCollection.find().toArray()
    articles.should.be.empty()
  })

  afterEach(function *() {
    yield _articlesCollection.deleteMany()
  })

  after(() => {
    _server.close()
    database.close()
    mediaTypes.clear()
  })

})
