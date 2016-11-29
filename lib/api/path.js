module.exports = {

  path: path => {
    const resolver = function () {
      let i = 0
      return path.replace(/:[a-zA-Z0-9]+/g, variable => arguments[i++] || variable)
    }
    resolver.path = path
    return resolver
  }

}
