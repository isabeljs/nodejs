const { MongoClient } = require("mongodb")

let database = null

function *connect(url) {
  database = yield MongoClient.connect(url)
}

module.exports = {
  connect,
  collection: name => database.collection(name),
  close: () => database.close()
}
