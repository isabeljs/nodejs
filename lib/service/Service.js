module.exports = class Service {

  constructor() {
    if (this.constructor.name === "Service") {
      throw new TypeError("Cannot instantiate Service")
    }
  }

}
