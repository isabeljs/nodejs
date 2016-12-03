const { MongoClient } = require("mongodb")

let database = null

module.exports = {

  connect: function *(url) {
    database = yield MongoClient.connect(url)
  },

  collection: name => database.collection(name),

  close: () => database.close()

}
