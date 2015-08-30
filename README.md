# express-formidable
An [Express](http://expressjs.com) middleware of
[Formidable](https://github.com/felixge/node-formidable) that just works.

## What are Express, Formidable, and this?

[Express](http://expressjs.com) is a fast, unopinionated, minimalist web
framework for Node.js.

[Formidable](https://github.com/felixge/node-formidable) is a Node.js module
for parsing form data, especially file uploads.

So, **`express-formidable`** is something like a bridge between them,
specifically an Express middleware implementation of Formidable.

It aims to just work.

## Install

```
npm install express-formidable@latest
```

## How to use

```js
var express = require('express');
var formidable = require('express-formidable');

var app = express();

app.use(formidable.parse());

app.post('/upload', function (req, res) {
  // req.body will contains the parsed body
});
```

And that's it.

**Requests having a `multipart/form-data` content-type will only be parsed.**

## TypeScript

This package is written in TypeScript, but you don't need to care about it for
normal usage.

If you'd like to use it with TypeScript, we provide `express-formidable.d.ts`
in the root directory of the built package. And we also have `typescript` field
in `package.json` which will be supported in the future.

To build from source, `make build`.

## Contribute

We use Makefile for our task manager as it's simple enough.

To build:
```
make build
```

To lint:
```
make lint
```

## License

[MIT](LICENSE)
