const Service = require("./Service")

module.exports = class CrudService extends Service {

  constructor(repository) {
    super()
    this.repository = repository
  }

  *getById(id) {
    return yield this.repository.getById(id)
  }

}
