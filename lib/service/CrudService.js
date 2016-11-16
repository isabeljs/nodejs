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

  *insertOne(resource) {
    return yield this.repository.insertOne(resource)
  }

  *replaceOneById(id, resource) {
    return yield this.repository.replaceOneById(id, resource)
  }

}
