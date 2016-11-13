const ObjectID = require("mongodb").ObjectID
const CrudRepository = require("../CrudRepository")

module.exports = class MongoCrudRepository extends CrudRepository {

  constructor(collection) {
    super()
    if (this.constructor.name === "MongoCrudRepository") {
      throw new TypeError("Cannot instantiate MongoCrudRepository directly")
    }
    this.collection = collection
  }

  *getById(id) {
    return yield this.collection.findOne({ _id: new ObjectID(id) })
  }

  *list() {
    return yield this.collection.find().toArray()
  }

  *create(document) {
    const result = yield this.collection.insertOne(document)
    return result.insertedCount === 0 ? null : result.ops[0]
  }

  *replace(id, document) {
    document._id = new ObjectID(id)
    const result = yield this.collection.replaceOne({ _id: new ObjectID(id) }, document)
    return result.modifiedCount === 0 ? null : result.ops[0]
  }

}
