const { path } = require("../../").api

module.exports = {
  article: path("/articles/:id"),
  articles: path("/articles")
}
