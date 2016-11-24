module.exports = class Repository {

  constructor() {
    if (this.constructor.name === "Repository") {
      throw new TypeError("Cannot instantiate Repository")
    }
  }

}
