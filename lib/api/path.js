module.exports = {

  path: path => Object.assign(
    (...values) => path.replace(/:[a-zA-Z0-9]+/g, variable => values.shift() || variable),
    { path }
  )

}
