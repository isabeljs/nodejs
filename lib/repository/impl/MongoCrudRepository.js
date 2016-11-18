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

  *insertOne(document, returnDocument) {
    const result = yield this.collection.insertOne(document)
    let returnValue = null
    if (result.insertedCount === 1) {
      returnValue = typeof returnDocument === "undefined" || returnDocument ? result.ops[0] : result.insertedId.toString()
    }
    return returnValue
  }

  *replaceOneById(id, document, returnDocument) {
    document._id = new ObjectID(id)
    const result = yield this.collection.replaceOne({ _id: new ObjectID(id) }, document)
    let returnValue = null
    if (result.modifiedCount === 1) {
      returnValue = typeof returnDocument === "undefined" || returnDocument ? yield this.findOneById(id) : id
    }
    return returnValue
  }

  *updateOneById(id, update, returnDocument) {
    const result = yield this.collection.updateOne({ _id: new ObjectID(id) }, { $set: update })
    let returnValue = null
    if (result.modifiedCount === 1) {
      returnValue = typeof returnDocument === "undefined" || returnDocument ? yield this.findOneById(id) : id
    }
    return returnValue
  }

  *deleteOneById(id, returnDocument) {
    let returnValue = typeof returnDocument === "undefined" || returnDocument ? this.findOneById(id) : null
    const result = yield this.collection.deleteOne({ _id: new ObjectID(id) })
    if (result.deletedCount === 1 && !returnValue) {
      returnValue = id
    }
    return returnValue
  }

}
