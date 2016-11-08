const path = require("../../").api.path

module.exports = {

  fromMongo: mongoObject => {
    return {
      id: mongoObject._id,
      title: mongoObject.title,
      content: mongoObject.content
    }
  },

  paths: {
    article: path("/articles/:id")
  }

}
