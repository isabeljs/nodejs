require("co-mocha")

const should = require("should")

const { MongoClient, ObjectID } = require("mongodb")

const CrudRepository = require("../CrudRepository")
const MongoCrudRepository = require("./MongoCrudRepository")

describe("MongoCrudRepository", () => {

  let _database = null
  let _articlesCollection = null
  let _articleRepository = null

  const _createArticle = function *() {
    const article = {
      title: Math.random().toString(36),
      content: Math.random().toString(36)
    }
    yield _articlesCollection.insertOne(article)
    return article
  }

  const _assertArticlesCollectionContainsOnly = function *(article) {
    const articles = yield _articlesCollection.find().toArray()
    articles.should.eql([article])
  }

  const _assertArticlesCollectionIsEmpty = function *() {
    const articles = yield _articlesCollection.find().toArray()
    articles.should.eql([])
  }

  const _checkInsertWhenReturningDocument = function *(...commands) {
    for (const command of commands) {
      const insert = {
        title: "New article title",
        content: "New article content"
      }
      const article = yield command(insert)
      article.should.be.an.Object()
      Object.keys(article).should.have.a.length(3)
      article.should.have.a.property("_id").which.is.an.Object()
      article.title.should.equal(insert.title)
      article.content.should.equal(insert.content)
      yield _assertArticlesCollectionContainsOnly(article)
      yield _articlesCollection.deleteMany()
    }
  }

  const _checkReplaceWhenReturningDocument = function *(...commands) {
    for (const command of commands) {
      const article = yield _createArticle()
      const replace = {
        title: "Updated article title",
        description: "Updated article description",
        tags: ["foo", "bar"]
      }
      const replaced = yield command(article._id.toString(), replace)
      replaced.should.eql({
        _id: article._id,
        title: replace.title,
        description: replace.description,
        tags: replace.tags
      })
      yield _assertArticlesCollectionContainsOnly(replaced)
      yield _articlesCollection.deleteMany()
    }
  }

  const _checkUpdateWhenReturningDocument = function *(...commands) {
    for (const command of commands) {
      const article = yield _createArticle()
      const update = {
        title: "Updated article title",
        description: "Updated article description",
        tags: ["foo", "bar"]
      }
      const updated = yield command(article._id.toString(), update)
      updated.should.eql({
        _id: article._id,
        title: update.title,
        content: article.content,
        description: update.description,
        tags: update.tags
      })
      yield _assertArticlesCollectionContainsOnly(updated)
      yield _articlesCollection.deleteMany()
    }
  }

  const _checkDeleteWhenReturningDocument = function *(...commands) {
    for (const command of commands) {
      const article = yield _createArticle()
      const deleted = yield command(article._id.toString())
      deleted.should.eql(article)
      yield _assertArticlesCollectionIsEmpty()
      yield _articlesCollection.deleteMany()
    }
  }

  const _checkDeleteWhenReturningDocuments = function *(...commands) {
    for (const command of commands) {
      const article1 = yield _createArticle()
      const article2 = yield _createArticle()
      const deleted1 = yield command()
      yield _assertArticlesCollectionIsEmpty()
      deleted1.should.be.an.Array().and.have.a.length(2)
      deleted1.should.containEql(article1)
      deleted1.should.containEql(article2)
      const deleted2 = yield _articleRepository.deleteMany()
      deleted2.should.be.an.Array().and.be.empty()
      yield _articlesCollection.deleteMany()
    }
  }

  before(function *() {
    _database = yield MongoClient.connect("mongodb://localhost:27017/ron")
    _articlesCollection = _database.collection("articles")
    _articleRepository = new class ArticleRepository extends MongoCrudRepository {

      constructor(collection) {
        super(collection)
      }

    }(_articlesCollection)
  })

  before(function *() {
    yield _articlesCollection.deleteMany()
  })

  it("should not be instantiable", () => {
    let instantiated = false
    try {
      new MongoCrudRepository()
      instantiated = true
    } catch (error) {
      error.should.be.an.instanceOf(TypeError)
      error.message.should.equal("Cannot instantiate MongoCrudRepository")
    } finally {
      instantiated.should.be.false()
    }
  })

  it("should implement all CrudRepository methods", () => {
    const expectedMethods = Object.getOwnPropertyNames(CrudRepository.prototype).filter(method => method !== "constructor")
    const actualMethods = Object.getOwnPropertyNames(MongoCrudRepository.prototype).filter(method => method !== "constructor")
    const forgottenExpectedMethods = expectedMethods.filter(method => actualMethods.indexOf(method) < 0)
    forgottenExpectedMethods.should.be.empty()
  })

  it("should find a document by id", function *() {
    const article = yield _createArticle()
    const found = yield _articleRepository.findOneById(article._id.toString())
    found.should.eql(article)
  })

  it("should return null when finding a nonexistent document by id", function *() {
    const found = yield _articleRepository.findOneById("000000000000000000000000")
    should(found).be.null()
  })

  it("should find documents", function *() {
    const article1 = yield _createArticle()
    const article2 = yield _createArticle()
    const found = yield _articleRepository.find()
    found.should.be.an.Array().and.have.a.length(2)
    found.should.containEql(article1)
    found.should.containEql(article2)
  })

  it("should return an empty array when finding nonexistent documents", function *() {
    const found = yield _articleRepository.find()
    found.should.be.an.Array().and.be.empty()
  })

  it("should insert a document and return the new database document", function *() {
    yield _checkInsertWhenReturningDocument(function *(insert) {
      return yield _articleRepository.insertOne(insert)
    }, function *(insert) {
      return yield _articleRepository.insertOne(insert, true)
    })
  })

  it("should insert a document and return the new database document id", function *() {
    const insert = {
      title: "New article title",
      content: "New article content"
    }
    const articleId = yield _articleRepository.insertOne(insert, false)
    articleId.should.match(/^[a-f\d]{24}$/i)
    yield _assertArticlesCollectionContainsOnly({
      _id: new ObjectID(articleId),
      title: insert.title,
      content: insert.content
    })
  })

  it("should replace a document and return the new database document", function *() {
    yield _checkReplaceWhenReturningDocument(function *(articleId, replace) {
      return yield _articleRepository.replaceOneById(articleId, replace)
    }, function *(articleId, replace) {
      return yield _articleRepository.replaceOneById(articleId, replace, true)
    })
  })

  it("should replace a document and return the new database document id", function *() {
    const article = yield _createArticle()
    const replace = {
      title: "Updated article title",
      description: "Updated article description",
      tags: ["foo", "bar"]
    }
    const replacedId = yield _articleRepository.replaceOneById(article._id.toString(), replace, false)
    replacedId.should.equal(article._id.toString())
    yield _assertArticlesCollectionContainsOnly({
      _id: new ObjectID(replacedId),
      title: replace.title,
      description: replace.description,
      tags: replace.tags
    })
  })

  it("should return null if the document to replace has not been found", function *() {
    const replace = {
      title: "Updated article title",
      description: "Updated article description",
      tags: ["foo", "bar"]
    }
    const replaced1 = yield _articleRepository.replaceOneById("000000000000000000000000", replace)
    const replaced2 = yield _articleRepository.replaceOneById("000000000000000000000000", replace, true)
    const replacedId3 = yield _articleRepository.replaceOneById("000000000000000000000000", replace, false)
    should(replaced1).be.null()
    should(replaced2).be.null()
    should(replacedId3).be.null()
  })

  it("should update a document and return the new database document", function *() {
    yield _checkUpdateWhenReturningDocument(function *(articleId, update) {
      return yield _articleRepository.updateOneById(articleId, update)
    }, function *(articleId, update) {
      return yield _articleRepository.updateOneById(articleId, update, true)
    })
  })

  it("should update a document and return the new database document id", function *() {
    const article = yield _createArticle()
    const update = {
      title: "Updated article title",
      description: "Updated article description",
      tags: ["foo", "bar"]
    }
    const updatedId = yield _articleRepository.updateOneById(article._id.toString(), update, false)
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
    const update = {
      title: "Updated article title",
      description: "Updated article description",
      tags: ["foo", "bar"]
    }
    const updated1 = yield _articleRepository.updateOneById("000000000000000000000000", update)
    const updated2 = yield _articleRepository.updateOneById("000000000000000000000000", update, true)
    const updatedId3 = yield _articleRepository.updateOneById("000000000000000000000000", update, false)
    should(updated1).be.null()
    should(updated2).be.null()
    should(updatedId3).be.null()
  })

  it("should delete a document and return the old database document", function *() {
    yield _checkDeleteWhenReturningDocument(function *(articleId) {
      return yield _articleRepository.deleteOneById(articleId)
    }, function *(articleId) {
      return yield _articleRepository.deleteOneById(articleId, true)
    })
  })

  it("should delete a document and return the old database document id", function *() {
    const article = yield _createArticle()
    const deletedId = yield _articleRepository.deleteOneById(article._id.toString(), false)
    deletedId.should.eql(article._id.toString())
    yield _assertArticlesCollectionIsEmpty()
  })

  it("should return null if the document to delete has not been found", function *() {
    const deleted1 = yield _articleRepository.deleteOneById("000000000000000000000000")
    const deleted2 = yield _articleRepository.deleteOneById("000000000000000000000000", true)
    const deletedId3 = yield _articleRepository.deleteOneById("000000000000000000000000", false)
    should(deleted1).be.null()
    should(deleted2).be.null()
    should(deletedId3).be.null()
  })

  it("should delete documents and return the old database documents", function *() {
    yield _checkDeleteWhenReturningDocuments(function *() {
      return yield _articleRepository.deleteMany()
    }, function *() {
      return yield _articleRepository.deleteMany(true)
    })
  })

  it("should delete documents and return the number of deleted documents", function *() {
    yield _createArticle()
    yield _createArticle()
    const deletedCount1 = yield _articleRepository.deleteMany(false)
    yield _assertArticlesCollectionIsEmpty()
    deletedCount1.should.equal(2)
    const deletedCount2 = yield _articleRepository.deleteMany(false)
    deletedCount2.should.equal(0)
  })

  afterEach(function *() {
    yield _articlesCollection.deleteMany()
  })

  after(() => {
    _database.close()
  })

})
