const url = require("url")

module.exports = class MediaType {

  constructor(name) {
   if (this.constructor.name === "MediaType") {
     throw new TypeError("Cannot instantiate MediaType directly")
   }
   this.name = name
  }

  convert() {
    throw new TypeError(`MediaType.convert(...) needs to be overridden by ${this.constructor.name}`)
  }

  static getBaseUrl(context) {
    return `${context.request.protocol}://${context.request.get("Host")}`
  }

}
