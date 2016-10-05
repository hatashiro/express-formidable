# express-formidable [![Build Status](https://travis-ci.org/noraesae/express-formidable.svg?branch=master)](https://travis-ci.org/noraesae/express-formidable)

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
const formidable = require('express-formidable');

var app = express();

app.use(formidable());

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
app.use(formidable(opts));
```

`opts` are options which can be set to `form` in Formidable. For example:

```js
app.use(formidable({
  encoding: 'utf-8',
  uploadDir: '/my/dir',
  multiples: true, // req.files to be arrays of files
});
```

For the detail, please refer to the
[Formidable API](https://github.com/felixge/node-formidable#api).

## Contribute

```
git clone https://github.com/noraesae/express-formidable.git
cd express-formidable
npm install
```

To lint and test:

```
npm test
```

## License

[MIT](LICENSE)
