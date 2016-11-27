const MongoClient = require("mongodb").MongoClient

let database = null

module.exports = {

  connect: function *(url) {
    database = yield MongoClient.connect(url)
  },

  collection: name => database.collection(name)

}
