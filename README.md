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
> And that's where I come in: I'm trying to go behind the buzzword REST became, and to (modestly and noninvasively) help you building *real RESTful services* with Node.js by providing tools and utilities built upon exciting technologies such as [ECMAScript 6](https://www.wikiwand.com/en/ECMAScript#/6th_Edition_-_ECMAScript_2015) and [koa](http://koajs.com/).
>
> I hope you appreciate my advices (please don't hesitate to correct me when I'm wrong), and have a happy coding!
>
> Isabel *(but call me Isa)*

## Documentation

### Repositories

Repositories are in charge of dealing with data. Period.

#### `Repository`

With Isabel, You can write a repository from scratch:

```js
const { Repository } = require("isabel")

module.exports = new class extends Repository {
  // ...
}
```

#### `CrudRepository`

You can also write a CRUD repository, in which case you'll have to provide the following methods:

 - `*findOneById(<K> id)`
 - `*findMany()`
 - `*insertOne(<V> resource, Boolean returnResource)`
 - `*replaceOneById(<K> id, <V> document, Boolean returnResource)`
 - `*updateOneById(<K> id, <V> document, Boolean returnResource)`
 - `*deleteOneById(<K> id, Boolean returnResource)`
 - `*deleteMany(Boolean returnResources)`

`<K>` is your resources' primary key type (e.g. `String`), and `<V>` is your resources' type (e.g. `Object`). The `returnResource(s)` flag indicates whether the database resource should be returned in case of a successful operation. If `false`, the database resource primary key should be returned. If the operation failed, `null` should be returned.

```js
const { CrudRepository } = require("isabel")

module.exports = new class extends CrudRepository {

  constructor() {
    super()
    // ...
  }

  *findOneById() {
    // ...
  }

  *findMany() {
    // ...
  }

  *insertOne() {
    // ...
  }

  *replaceOneById() {
    // ...
  }

  *updateOneById() {
    // ...
  }

  *deleteOneById() {
    // ...
  }

  *deleteMany() {
    // ...
  }

}
```
