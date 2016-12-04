const { ObjectID } = require("mongodb")
const CrudRepository = require("../CrudRepository")

module.exports = class MongoCrudRepository extends CrudRepository {

  constructor(collection) {
    super()
    if (this.constructor.name === "MongoCrudRepository") {
      throw new TypeError("Cannot instantiate MongoCrudRepository")
    }
    this.collection = collection
  }

  *findOneById(id) {
    return yield this.collection.findOne({ _id: new ObjectID(id) })
  }

  *findMany() {
    return yield this.collection.find().toArray()
  }

  *insertOne(document, returnDocument = true) {
    const result = yield this.collection.insertOne(document)
    return returnDocument ? result.ops[0] : result.insertedId.toString()
  }

  *replaceOneById(id, document, returnDocument = true) {
    document._id = new ObjectID(id)
    const result = yield this.collection.replaceOne({ _id: new ObjectID(id) }, document)
    let returnValue = null
    if (result.modifiedCount === 1) {
      returnValue = returnDocument ? yield this.findOneById(id) : id
    }
    return returnValue
  }

  *updateOneById(id, update, returnDocument = true) {
    const result = yield this.collection.updateOne({ _id: new ObjectID(id) }, { $set: update })
    let returnValue = null
    if (result.modifiedCount === 1) {
      returnValue = returnDocument ? yield this.findOneById(id) : id
    }
    return returnValue
  }

  *deleteOneById(id, returnDocument = true) {
    let returnValue = null
    let launchDelete = true
    if (returnDocument) {
      returnValue = yield this.findOneById(id)
      launchDelete = returnValue !== null
    }
    if (launchDelete) {
      const result = yield this.collection.deleteOne({ _id: new ObjectID(id) })
      if (result.deletedCount === 1 && !returnValue) {
        returnValue = id
      }
    }
    return returnValue
  }

  *deleteMany(returnDocuments = true) {
    let returnValue = null
    let launchDelete = true
    if (returnDocuments) {
      returnValue = yield this.findMany()
      launchDelete = returnValue.length > 0
    }
    if (launchDelete) {
      const result = yield this.collection.deleteMany()
      if (!returnValue) {
        returnValue = result.deletedCount
      }
    }
    return returnValue
  }

}
