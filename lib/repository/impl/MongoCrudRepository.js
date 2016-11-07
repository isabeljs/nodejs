const ObjectID = require("mongodb").ObjectID
const CrudRepository = require("../CrudRepository")

module.exports = class MongoCrudRepository extends CrudRepository {

  constructor(collection) {
    super()
    this.collection = collection
  }

  *getById(id) {
    return yield this.collection.findOne({ _id: new ObjectID(id) })
  }

}
