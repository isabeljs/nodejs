const MongoCrudRepository = require("../../").MongoCrudRepository()
const database = require("../database")

module.exports = new class ArticleRepository extends MongoCrudRepository {

  constructor(collection) {
    super(collection)
  }

}(database.collection("articles"))
