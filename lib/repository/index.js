const Repository = require("./Repository")
const CrudRepository = require("./CrudRepository")
let MongoCrudRepository = null

module.exports = {
  Repository,
  CrudRepository,
  MongoCrudRepository: () => MongoCrudRepository = MongoCrudRepository || require("./impl/MongoCrudRepository")
}
