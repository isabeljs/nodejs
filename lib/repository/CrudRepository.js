const ObjectID = require("mongodb").ObjectID
const Repository = require("./Repository")

module.exports = class CrudRepository extends Repository {

  constructor(collection) {
    super()
    this.collection = collection
  }

  *getById(id) {
    return yield this.collection.findOne({ _id: new ObjectID(id) })
  }

}
