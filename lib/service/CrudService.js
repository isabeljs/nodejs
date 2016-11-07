const CrudRepository = require("../repository/").CrudRepository
const Service = require("./Service")

module.exports = class CrudService extends Service {

  constructor(repository) {
    super()
    if (!(repository instanceof CrudRepository)) {
      throw new TypeError("Repository must be an instance of CrudRepository")
    }
    this.repository = repository
  }

  *getById(id) {
    return yield this.repository.getById(id)
  }

}
