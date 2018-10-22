# express-formidable [![Build Status](https://travis-ci.org/utatti/express-formidable.svg?branch=master)](https://travis-ci.org/utatti/express-formidable)

An [Express](http://expressjs.com) middleware of
[Formidable](https://github.com/felixge/node-formidable) that just works.

## What are Express, Formidable, and this?

[Express](http://expressjs.com) is a fast, unopinionated, minimalist web
framework for Node.js.

[Formidable](https://github.com/felixge/node-formidable) is a Node.js module
for parsing form data, including `multipart/form-data` file upload.

So, **`express-formidable`** is something like a bridge between them,
specifically an Express middleware implementation of Formidable.

It aims to just work.

## Install

```
npm install express-formidable
```

## How to use

```js
const express = require('express');
const formidableMiddleware = require('express-formidable');

var app = express();

app.use(formidableMiddleware());

app.post('/upload', (req, res) => {
  req.fields; // contains non-file fields
  req.files; // contains files
});
```

And that's it.

express-formidable can basically parse form types Formidable can handle,
including `application/x-www-form-urlencoded`, `application/json`, and
`multipart/form-data`.

## Option

```js
app.use(formidableMiddleware(opts));
```

`opts` are options which can be set to `form` in Formidable. For example:

```js
app.use(formidableMiddleware({
  encoding: 'utf-8',
  uploadDir: '/my/dir',
  multiples: true, // req.files to be arrays of files
});
```

For the detail, please refer to the
[Formidable API](https://github.com/felixge/node-formidable#api).

## Events

```js
app.use(formidableMiddleware(opts, events));
```

`events` is an array of json with two field:

| Field | Description |
| ----- | ----------- |
| `event` | The event emitted by the form of formidable. A complete list of all the possible events, please refer to the [Formidable Events](https://github.com/felixge/node-formidable#events) |
| `action` | The callback to execute. The signature is `function (req, res, next, ...formidable_parameters)` |

For example:

```js
const events = [
  {
    event: 'fileBegin',
    action: function (req, res, next, name, file) { /* your callback */ }
  }, 
  {
    event: 'field',
    action: function (req, res, next, name, value) { /* your callback */ }
  }
];
```

### Error event

Unless an `error` event are provided by the `events` array parameter, it will handle by the standard `next(error)`.

## Contribute

```
git clone https://github.com/utatti/express-formidable.git
cd express-formidable
npm install
```

To lint and test:

```
npm test
```

## License

[MIT](LICENSE)
