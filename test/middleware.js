'use strict';

const assert = require('assert');
const express = require('express');
const formidable = require('../lib/middleware');
const fs = require('fs');
const path = require('path');
const send = require('./helpers/send');

const app = express();

describe('express-formidable', () => {
  let server = null;
  let callback = null;

  app.use(formidable());
  app.post('/', req => callback(req));

  before((done) => {
    server = app.listen(1234, done);
  });
  after(() => server.close());

  it('parses application/x-www-form-urlencoded', (done) => {
    send('application/x-www-form-urlencoded', {
      hello: 'world',
      foo: 'bar',
      number: 20161006,
    });

    callback = (req) => {
      assert.equal(req.fields.hello, 'world');
      assert.equal(req.fields.foo, 'bar');
      assert.equal(req.fields.number, '20161006');
      done();
    };
  });

  it('parses application/json', (done) => {
    send('application/json', {
      hello: 'world',
      foo: 'bar',
      number: 20161006,
    });

    callback = (req) => {
      assert.equal(req.fields.hello, 'world');
      assert.equal(req.fields.foo, 'bar');
      assert.equal(req.fields.number, '20161006');
      done();
    };
  });

  it('parses multipart/form-data without a file', (done) => {
    send('multipart/form-data', {
      hello: 'world',
      foo: 'bar',
      number: 20161006,
    });

    callback = (req) => {
      assert.equal(req.fields.hello, 'world');
      assert.equal(req.fields.foo, 'bar');
      assert.equal(req.fields.number, '20161006');
      done();
    };
  });

  function fileTest(file, content) {
    assert.equal(fs.readFileSync(file.path).toString(), content);
  }

  it('parses multipart/form-data with files', (done) => {
    send('multipart/form-data', {
      hello: 'world',
      foo: 'bar',
      number: 20161006,
      file1: fs.createReadStream(path.join(__dirname, '/fixtures/file1.txt')),
      file2: fs.createReadStream(path.join(__dirname, '/fixtures/file2.txt')),
    });

    callback = (req) => {
      assert.equal(req.fields.hello, 'world');
      assert.equal(req.fields.foo, 'bar');
      assert.equal(req.fields.number, '20161006');

      fileTest(req.files.file1, 'You\'re file 1.\n');
      fileTest(req.files.file2, 'I\'m file 2.\n');

      done();
    };
  });
});
