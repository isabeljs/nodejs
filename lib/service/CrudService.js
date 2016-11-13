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

  *getById(id) {
    return yield this.repository.getById(id)
  }

  *list() {
    return yield this.repository.list()
  }

  *create(resource) {
    return yield this.repository.create(resource)
  }

  *replace(id, resource) {
    return yield this.repository.replace(id, resource)
  }

}
