const Repository = require("./Repository")
const CrudRepository = require("./CrudRepository")
const MongoCrudRepository = require("./impl/MongoCrudRepository")

module.exports = { Repository, CrudRepository, MongoCrudRepository }
