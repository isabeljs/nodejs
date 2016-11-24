const Repository = require("./Repository")

module.exports = class CrudRepository extends Repository {

  constructor() {
    super()
    if (this.constructor.name === "CrudRepository") {
      throw new TypeError("Cannot instantiate CrudRepository")
    }
  }

  *findOneById() {
    throw new TypeError(`CrudRepository.findOneById(...) needs to be overridden by ${this.constructor.name}`)
  }

  *find() {
    throw new TypeError(`CrudRepository.find(...) needs to be overridden by ${this.constructor.name}`)
  }

  *insertOne() {
    throw new TypeError(`CrudRepository.insertOne(...) needs to be overridden by ${this.constructor.name}`)
  }

  *replaceOneById() {
    throw new TypeError(`CrudRepository.replaceOneById(...) needs to be overridden by ${this.constructor.name}`)
  }

  *updateOneById() {
    throw new TypeError(`CrudRepository.updateOneById(...) needs to be overridden by ${this.constructor.name}`)
  }

  *deleteOneById() {
    throw new TypeError(`CrudRepository.deleteOneById(...) needs to be overridden by ${this.constructor.name}`)
  }

  *deleteMany() {
    throw new TypeError(`CrudRepository.deleteMany(...) needs to be overridden by ${this.constructor.name}`)
  }

}
