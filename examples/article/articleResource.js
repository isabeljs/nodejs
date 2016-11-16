const path = require("../../").api.path

module.exports = {

  fromMongo: mongoObject => {
    const article = {
      id: mongoObject._id,
      title: mongoObject.title
    }
    if (mongoObject.hasOwnProperty("content")) {
      article.content = mongoObject.content
    }
    if (mongoObject.hasOwnProperty("description")) {
      article.description = mongoObject.description
    }
    return article
  },

  paths: {
    article: path("/articles/:id"),
    articles: path("/articles")
  }

}
