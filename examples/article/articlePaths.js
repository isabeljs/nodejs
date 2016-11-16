const path = require("../../").api.path

module.exports = {
  article: path("/articles/:id"),
  articles: path("/articles")
}
