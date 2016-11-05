const ron = require("../")
const database = require("./database")

module.exports = new class articleRepository extends ron.CrudRepository {

  constructor(collection) {
    super(collection)
  }

}(database.collection("articles"))
