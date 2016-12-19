const Repository = require("./Repository")

module.exports = class CrudRepository extends Repository {

  constructor() {
    super()
    if (this.constructor.name === "CrudRepository") {
      throw new TypeError("Cannot instantiate CrudRepository")
    }
  }

  /* eslint-disable require-yield */

  *findOneById() {
    throw new TypeError(`CrudRepository.findOneById(...) needs to be overridden by ${this.constructor.name || "anonymous subclass"}`)
  }

  *findMany() {
    throw new TypeError(`CrudRepository.findMany(...) needs to be overridden by ${this.constructor.name || "anonymous subclass"}`)
  }

  *insertOne() {
    throw new TypeError(`CrudRepository.insertOne(...) needs to be overridden by ${this.constructor.name || "anonymous subclass"}`)
  }

  *replaceOneById() {
    throw new TypeError(`CrudRepository.replaceOneById(...) needs to be overridden by ${this.constructor.name || "anonymous subclass"}`)
  }

  *updateOneById() {
    throw new TypeError(`CrudRepository.updateOneById(...) needs to be overridden by ${this.constructor.name || "anonymous subclass"}`)
  }

  *deleteOneById() {
    throw new TypeError(`CrudRepository.deleteOneById(...) needs to be overridden by ${this.constructor.name || "anonymous subclass"}`)
  }

  *deleteMany() {
    throw new TypeError(`CrudRepository.deleteMany(...) needs to be overridden by ${this.constructor.name || "anonymous subclass"}`)
  }

  /* eslint-enable require-yield */

}
