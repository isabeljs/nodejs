const Repository = require("./Repository")

module.exports = class CrudRepository extends Repository {

  constructor(collection) {
    super()
    if (this.constructor.name === "CrudRepository") {
      throw new TypeError("Cannot instantiate CrudRepository directly")
    }
  }

  *getById() {
    throw new TypeError(`CrudRepository.getById(...) needs to be overridden by ${this.constructor.name}`)
  }

  *list() {
    throw new TypeError(`CrudRepository.list(...) needs to be overridden by ${this.constructor.name}`)
  }

  *create() {
    throw new TypeError(`CrudRepository.create(...) needs to be overridden by ${this.constructor.name}`)
  }

}
