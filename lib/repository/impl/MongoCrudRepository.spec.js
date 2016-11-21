require("co-mocha")

const should = require("should")

const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

const MongoCrudRepository = require("./MongoCrudRepository")

describe("MongoCrudRepository", () => {

  let articlesCollection = null
  let articleRepository = null

  const _createArticle = function *() {
    const article = {
      title: Math.random().toString(36),
      content: Math.random().toString(36)
    }
    yield articlesCollection.insertOne(article)
    return article
  }

  const _assertArticlesCollectionContainsOnly = function *(article) {
    const articles = yield articlesCollection.find().toArray()
    articles.should.eql([article])
  }

  const _assertArticlesCollectionIsEmpty = function *() {
    const articles = yield articlesCollection.find().toArray()
    articles.should.eql([])
  }

  before(function *() {
    articlesCollection = (yield MongoClient.connect("mongodb://localhost:27017/ron")).collection("articles")
    articleRepository = new class ArticleRepository extends MongoCrudRepository {

      constructor(collection) {
        super(collection)
      }

    }(articlesCollection)
  })

  it("should not be directly instantiable", function *() {
    let instantiated = false
    try {
      new MongoCrudRepository()
      instantiated = true
    } catch (error) {
      error.should.be.an.instanceOf(TypeError)
      error.message.should.equal("Cannot instantiate MongoCrudRepository directly")
    } finally {
      instantiated.should.be.false()
    }
  })

  it("should find a document by id", function *() {
    const article = yield _createArticle()
    const found = yield articleRepository.findOneById(article._id.toString())
    found.should.eql(article)
  })

  it("should return null when finding a nonexistent document by id", function *() {
    const found = yield articleRepository.findOneById("000000000000000000000000")
    should(found).be.null()
  })

  it("should find documents", function *() {
    const article1 = yield _createArticle()
    const article2 = yield _createArticle()
    const found = yield articleRepository.find()
    found.should.be.an.Array().and.have.a.length(2)
    found.should.containEql(article1)
    found.should.containEql(article2)
  })

  it("should return an empty array when finding nonexistent documents", function *() {
    const found = yield articleRepository.find()
    found.should.be.an.Array().and.be.empty()
  })

  it("should insert a document and return the new database document by default", function *() {
    const article = {
      title: "New article title",
      content: "New article content"
    }
    const created = yield articleRepository.insertOne(article)
    created.should.be.an.Object()
    Object.keys(created).should.have.a.length(3)
    created.should.have.a.property("_id").which.is.an.Object()
    created.title.should.equal(article.title)
    created.content.should.equal(article.content)
    yield _assertArticlesCollectionContainsOnly(article)
  })

  it("should insert a document and return the new database document when passing true", function *() {
    const article = {
      title: "New article title",
      content: "New article content"
    }
    const created = yield articleRepository.insertOne(article, true)
    created.should.be.an.Object()
    Object.keys(created).should.have.a.length(3)
    created.should.have.a.property("_id").which.is.an.Object()
    created.title.should.equal(article.title)
    created.content.should.equal(article.content)
    yield _assertArticlesCollectionContainsOnly(article)
  })

  it("should insert a document and return the new database document id when passing false", function *() {
    const article = {
      title: "New article title",
      content: "New article content"
    }
    const createdId = yield articleRepository.insertOne(article, false)
    createdId.should.match(/^[a-f\d]{24}$/i)
    yield _assertArticlesCollectionContainsOnly({
      _id: new ObjectID(createdId),
      title: article.title,
      content: article.content
    })
  })

  it("should replace a document and return the new database document by default", function *() {
    const article = yield _createArticle()
    const update = {
      title: "Updated article title",
      description: "Updated article description",
      tags: ["foo", "bar"]
    }
    const replaced = yield articleRepository.replaceOneById(article._id.toString(), update)
    replaced.should.eql({
      _id: article._id,
      title: update.title,
      description: update.description,
      tags: update.tags
    })
    yield _assertArticlesCollectionContainsOnly(replaced)
  })

  it("should replace a document and return the new database document when passing true", function *() {
    const article = yield _createArticle()
    const update = {
      title: "Updated article title",
      description: "Updated article description",
      tags: ["foo", "bar"]
    }
    const replaced = yield articleRepository.replaceOneById(article._id.toString(), update, true)
    replaced.should.eql({
      _id: article._id,
      title: update.title,
      description: update.description,
      tags: update.tags
    })
    yield _assertArticlesCollectionContainsOnly(replaced)
  })

  it("should replace a document and return the new database document id when passing false", function *() {
    const article = yield _createArticle()
    const update = {
      title: "Updated article title",
      description: "Updated article description",
      tags: ["foo", "bar"]
    }
    const replacedId = yield articleRepository.replaceOneById(article._id.toString(), update, false)
    replacedId.should.equal(article._id.toString())
    yield _assertArticlesCollectionContainsOnly({
      _id: new ObjectID(replacedId),
      title: update.title,
      description: update.description,
      tags: update.tags
    })
  })

  it("should return null if the document to replace has not been found", function *() {
    const replaced1 = yield articleRepository.replaceOneById("000000000000000000000000", {})
    const replaced2 = yield articleRepository.replaceOneById("000000000000000000000000", {}, true)
    const replacedId3 = yield articleRepository.replaceOneById("000000000000000000000000", {}, false)
    should(replaced1).be.null()
    should(replaced2).be.null()
    should(replacedId3).be.null()
  })

  it("should update a document and return the new database document by default", function *() {
    const article = yield _createArticle()
    const update = {
      title: "Updated article title",
      description: "Updated article description",
      tags: ["foo", "bar"]
    }
    const updated = yield articleRepository.updateOneById(article._id.toString(), update)
    updated.should.eql({
      _id: article._id,
      title: update.title,
      content: article.content,
      description: update.description,
      tags: update.tags
    })
    yield _assertArticlesCollectionContainsOnly(updated)
  })

  it("should update a document and return the new database document when passing true", function *() {
    const article = yield _createArticle()
    const update = {
      title: "Updated article title",
      description: "Updated article description",
      tags: ["foo", "bar"]
    }
    const updated = yield articleRepository.updateOneById(article._id.toString(), update, true)
    updated.should.eql({
      _id: article._id,
      title: update.title,
      content: article.content,
      description: update.description,
      tags: update.tags
    })
    yield _assertArticlesCollectionContainsOnly(updated)
  })

  it("should update a document and return the new database document id when passing false", function *() {
    const article = yield _createArticle()
    const update = {
      title: "Updated article title",
      description: "Updated article description",
      tags: ["foo", "bar"]
    }
    const updatedId = yield articleRepository.updateOneById(article._id.toString(), update, false)
    updatedId.should.equal(article._id.toString())
    yield _assertArticlesCollectionContainsOnly({
      _id: new ObjectID(updatedId),
      title: update.title,
      content: article.content,
      description: update.description,
      tags: update.tags
    })
  })

  it("should return null if the document to update has not been found", function *() {
    const updated1 = yield articleRepository.updateOneById("000000000000000000000000", {})
    const updated2 = yield articleRepository.updateOneById("000000000000000000000000", {}, true)
    const updatedId3 = yield articleRepository.updateOneById("000000000000000000000000", {}, false)
    should(updated1).be.null()
    should(updated2).be.null()
    should(updatedId3).be.null()
  })

  it("should delete a document and return the old database document by default", function *() {
    const article = yield _createArticle()
    const deleted = yield articleRepository.deleteOneById(article._id.toString())
    deleted.should.eql(article)
    yield _assertArticlesCollectionIsEmpty()
  })

  it("should delete a document and return the old database document when passing true", function *() {
    const article = yield _createArticle()
    const deleted = yield articleRepository.deleteOneById(article._id.toString(), true)
    deleted.should.eql(article)
    yield _assertArticlesCollectionIsEmpty()
  })

  it("should delete a document and return the old database document id when passing false", function *() {
    const article = yield _createArticle()
    const deletedId = yield articleRepository.deleteOneById(article._id.toString(), false)
    deletedId.should.eql(article._id.toString())
    yield _assertArticlesCollectionIsEmpty()
  })

  it("should return null if the document to delete has not been found", function *() {
    const deleted1 = yield articleRepository.deleteOneById("000000000000000000000000")
    const deleted2 = yield articleRepository.deleteOneById("000000000000000000000000", true)
    const deletedId3 = yield articleRepository.deleteOneById("000000000000000000000000", false)
    should(deleted1).be.null()
    should(deleted2).be.null()
    should(deletedId3).be.null()
  })

  it("should delete documents and return the old database documents by default", function *() {
    const article1 = yield _createArticle()
    const article2 = yield _createArticle()
    const deleted1 = yield articleRepository.deleteMany()
    yield _assertArticlesCollectionIsEmpty()
    deleted1.should.be.an.Array().and.have.a.length(2)
    deleted1.should.containEql(article1)
    deleted1.should.containEql(article2)
    const deleted2 = yield articleRepository.deleteMany()
    deleted2.should.be.an.Array().and.be.empty()
  })

  it("should delete documents and return the old database documents when passing true", function *() {
    const article1 = yield _createArticle()
    const article2 = yield _createArticle()
    const deleted1 = yield articleRepository.deleteMany(true)
    yield _assertArticlesCollectionIsEmpty()
    deleted1.should.be.an.Array().and.have.a.length(2)
    deleted1.should.containEql(article1)
    deleted1.should.containEql(article2)
    const deleted2 = yield articleRepository.deleteMany(true)
    deleted2.should.be.an.Array().and.be.empty()
  })

  it("should delete documents and return the number of deleted documents when passing false", function *() {
    yield _createArticle()
    yield _createArticle()
    const deletedCount1 = yield articleRepository.deleteMany(false)
    yield _assertArticlesCollectionIsEmpty()
    deletedCount1.should.equal(2)
    const deletedCount2 = yield articleRepository.deleteMany(false)
    deletedCount2.should.equal(0)
  })

  afterEach(function *() {
    yield articlesCollection.deleteMany()
  })

})
