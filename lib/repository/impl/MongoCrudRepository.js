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
    return (yield this.collection.insertOne(document)).ops[0]
  }

}
