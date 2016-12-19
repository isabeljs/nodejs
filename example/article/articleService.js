const { CrudService } = require("../../")
const articleRepository = require("./articleRepository")

module.exports = new class ArticleService extends CrudService {

  // no specific methods

}(articleRepository)
