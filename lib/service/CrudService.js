const CrudRepository = require("../repository/").CrudRepository
const Service = require("./Service")

module.exports = class CrudService extends Service {

  constructor(repository) {
    super()
    if (this.constructor.name === "CrudService") {
      throw new TypeError("Cannot instantiate CrudService directly")
    }
    if (!(repository instanceof CrudRepository)) {
      throw new TypeError("Repository must be an instance of CrudRepository")
    }
    this.repository = repository
  }

  *findOneById(id) {
    return yield this.repository.findOneById(id)
  }

  *find() {
    return yield this.repository.find()
  }

  *insertOne(resource, returnResource) {
    return yield this.repository.insertOne(resource, returnResource)
  }

  *replaceOneById(id, resource, returnResource) {
    return yield this.repository.replaceOneById(id, resource, returnResource)
  }

  *updateOneById(id, update, returnResource) {
    return yield this.repository.updateOneById(id, update, returnResource)
  }

  *deleteOneById(id, returnResource) {
    return yield this.repository.deleteOneById(id, returnResource)
  }

  *deleteMany() {
    return yield this.repository.deleteMany()
  }

}
