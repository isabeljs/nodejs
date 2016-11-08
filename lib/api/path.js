module.exports = {

  path: function path(path) {
    const resolver = function () {
      let i = 0
      return path.replace(/:[a-zA-Z]+/g, () => arguments[i++])
    }
    resolver.path = path
    return resolver
  }
  
}
