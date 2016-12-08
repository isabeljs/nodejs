# Isabel

*REST over Node.js*

[![Build](https://api.travis-ci.org/isabeljs/nodejs.svg?branch=develop)](https://travis-ci.org/isabeljs/nodejs)
[![Coverage](https://coveralls.io/repos/github/isabeljs/nodejs/badge.svg?branch=develop)](https://coveralls.io/github/isabeljs/nodejs?branch=develop)
[![Dependencies](https://david-dm.org/isabeljs/nodejs/status.svg)](https://david-dm.org/isabeljs/nodejs)
[![Vulnerabilities](https://snyk.io/test/github/isabeljs/nodejs/badge.svg)](https://snyk.io/test/github/isabeljs/nodejs)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](https://opensource.org/licenses/MIT)

## Editorial

> Hey :)
>
> You may wonder: *why on earth would I need yet another framework to build my RESTful services?!* Well, that's a very good question, I'm glad you asked!
>
> As you may already know, in his blog post *[REST APIs must be hypertext-driven](http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven)*, Roy Fielding [editor's note: the coiner of REST] clarified that **just invoking a service via HTTP does not make it RESTful**. Indeed, in order for an API to be *effectively RESTful*, **it has to adhere to a given set of constraints** (like being stateless, resource-focused, hypertext-driven, etc.), that help building scalable and loosely coupled systems.
>
> And that's where I come in: I'm trying to go behind the buzzword REST became, and to (modestly and non-invasively) help you building *real RESTful services* with Node.js by providing tools and utilities built upon exciting technologies such as [ECMAScript 6](https://www.wikiwand.com/en/ECMAScript#/6th_Edition_-_ECMAScript_2015) and [koa](http://koajs.com/).
>
> I hope you appreciate my advices (please don't hesitate to correct me when I'm wrong), and have a happy coding!
>
> Isabel *(but call me Isa)*

## Documentation

### Repositories

Repositories exchange with the datasource(s).

#### `Repository`

With Isabel, you can write a repository from scratch:

```js
const { Repository } = require("isabel")

module.exports = new class extends Repository {
  // ...
}
```

#### `CrudRepository`

You can also write a CRUD repository, in which case you'll have to provide **at least** the following methods:

 - `*findOneById(<K> id)`
 - `*findMany()`
 - `*insertOne(<V> resource, Boolean returnResource)`
 - `*replaceOneById(<K> id, <V> resource, Boolean returnResource)`
 - `*updateOneById(<K> id, <V> update, Boolean returnResource)`
 - `*deleteOneById(<K> id, Boolean returnResource)`
 - `*deleteMany(Boolean returnResources)`

Of course, nothing stops you from adding custom methods, depending on your needs.

`<K>` is your resources' primary key type (e.g. `String`), and `<V>` is your resources' type (e.g. `Object`). The `returnResource(s)` flag indicates whether the database resource(s) should be returned **in case of a successful operation**. If `false`, the database resource primary key should be returned, except with `deleteMany(...)` where the number of deleted resources should be returned. If the operation failed, `null` should be returned.

```js
const { CrudRepository } = require("isabel")

module.exports = new class extends CrudRepository {

  constructor() {
    super()
    // ...
  }

  *findOneById(id) {
    // ...
  }

  *findMany() {
    // ...
  }

  *findManyByDateGte(date) {
    // custom method
  }

  *insertOne(resource, returnResource = true) {
    // ...
  }

  *replaceOneById(id, resource, returnResource = true) {
    // ...
  }

  *updateOneById(id, update, returnResource = true) {
    // ...
  }

  *deleteOneById(id, returnResource = true) {
    // ...
  }

  *deleteMany(returnResources = true) {
    // ...
  }

}
```

#### `MongoCrudRepository`

If you're using a MongoDB database, Isabel already provides a CRUD repository for it, using the [native MongoDB Node.js driver](https://mongodb.github.io/node-mongodb-native/). You'll need to install it on your own though: `npm install --save mongodb` (tested with version `^2.2.11`). While all the methods from [`CrudRepository`](#CrudRepository) are implemented thanks to the enclosed [`collection`](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html), nothing stops you from overriding them (or adding custom methods of course).

Please note that the `returnResource(s)` flag is defaulted to `true` for all the CRUD methods in `MongoCrudRepository`. For `replaceOneById(...)`, `updateOneById(...)`, `deleteOneById(...)` and `deleteMany(...)`, **having the `returnResource(s)` flag set to `true` can lead to executing two database queries instead of only one**, as another query may be needed to fetch the database resource(s). So when you don't need the database resource(s) to be returned, you should better set the `returnResource(s)` flag to `false` when calling the CRUD method, e.g. `yield myMongoCrudRepository.replaceOneById(id, document, false)` instead of `yield myMongoCrudRepository.replaceOneById(id, document[, true])`. Another solution is to override theses methods to default the `returnResource(s)` flag to false.

You should also note that `require("isabel").MongoCrudRepository()` is a function that returns the `MongoCrudRepository` class (in contrary to [`Repository`](#Repository) or [`CrudRepository`](#CrudRepository) for example, which expose their class directly).

```js
const MongoCrudRepository = require("isabel").MongoCrudRepository()
const database = require(".../database")

module.exports = new class extends MongoCrudRepository {

  constructor(collection) {
    super(collection)
  }

  *findMany() {
    // overriding to sort the results by date descending by default
    return yield this.collection.find().sort([["date", -1]]).toArray()
  }

  *replaceOneById(id, resource, returnResource = false) {
    // overriding to default the `returnResource` flag to `false` instead of `true`
    return yield super.replaceOneById(id, resource, returnResource)
  }

}(database.collection("..."))
```

### Services

Services hold the application logic.

#### `Service`

With Isabel, you can write a service from scratch:

```js
const { Service } = require("isabel")

module.exports = new class extends Service {
  // ...
}
```

#### `CrudService`

You can also write a CRUD service, which will then automatically implement the same methods as a [`CrudRepository`](#CrudRepository), and delegate each call to the enclosed [`CrudRepository`](#CrudRepository). Again, you can of course override the default implementations or add custom methods.

Note that these services don't hold much logic, as they only delegate to enclosed [`CrudRepository`](#CrudRepository). In real-life use cases, they would certainly be more complex, holding the application logic and algorithms.

```js
const { CrudService } = require("isabel")
const myCrudRepository = require(".../myCrudRepository")

module.exports = new class extends CrudService {

  constructor(repository) {
    super(repository)
  }

  *findManyByDateGte(date) {
    // custom method
    return yield this.repository.findManyByDateGte(date)
  }

}(myCrudRepository)
```
