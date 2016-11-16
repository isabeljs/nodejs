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

  *findOneById(id) {
    return yield this.collection.findOne({ _id: new ObjectID(id) })
  }

  *find() {
    return yield this.collection.find().toArray()
  }

  *insertOne(document) {
    const result = yield this.collection.insertOne(document)
    return result.insertedCount === 0 ? null : result.ops[0]
  }

  *replaceOneById(id, document) {
    document._id = new ObjectID(id)
    const result = yield this.collection.replaceOne({ _id: new ObjectID(id) }, document)
    return result.modifiedCount === 0 ? null : result.ops[0]
  }

}
