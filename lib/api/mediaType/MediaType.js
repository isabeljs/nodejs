module.exports = class MediaType {

  constructor(name) {
    if (this.constructor.name === "MediaType") {
      throw new TypeError("Cannot instantiate MediaType")
    }
    this.name = name
  }

  represent() {
    throw new TypeError(`MediaType.represent(...) needs to be overridden by ${this.constructor.name || "anonymous subclass"}`)
  }

}
