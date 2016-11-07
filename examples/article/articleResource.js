const path = require("../../").resource.path

module.exports = {
  fromMongo: mongoObject => {
    return {
      id: mongoObject._id,
      title: mongoObject.title,
      content: mongoObject.content
    }
  },
  article: path("/articles/:id")
}
