const MongoClient = require("mongodb").MongoClient

let database = undefined

module.exports = {

  connect: function *(url) {
    database = yield MongoClient.connect(url)
  },

  get: () => database,

  collection: name => database.collection(name)

}
