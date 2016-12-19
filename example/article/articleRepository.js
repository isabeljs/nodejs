const MongoCrudRepository = require("../../").MongoCrudRepository()
const database = require("../database")

module.exports = new class ArticleRepository extends MongoCrudRepository {

  // no specific methods

}(database.collection("articles"))
