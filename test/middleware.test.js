'use strict';

const assert = require('assert');
const express = require('express');
const formidable = require('../lib/middleware');
const fs = require('fs');
const path = require('path');
const send = require('./helpers/send');

const app = express();

let callback = null;

app.post('/', formidable(), req => callback(req));

beforeAll(done => app.listen(1234, done));

test('parses application/x-www-form-urlencoded', (done) => {
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

test('parses application/json', (done) => {
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

test('parses multipart/form-data without a file', (done) => {
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

test('parses multipart/form-data with files', (done) => {
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

let numberOfFields;
let numberOfFilesBegin;
let numberOfFiles;
let endReached;

const events = [
  {
    event: 'fileBegin',
    action: (req, res, next, name, file) => {
      assert(name, 'name is null');
      assert(file, 'file is null');
      numberOfFilesBegin += 1;
    },
  },
  {
    event: 'field',
    action: (req, res, next, name, value) => {
      assert(name, 'name is null');
      assert(value, 'value is null');
      numberOfFields += 1;
    },
  },
  {
    event: 'progress',
    action: (req, res, next, bytesReceived, bytesExpected) => {
      assert(bytesExpected, 'bytesExpected is null');
    },
  },
  {
    event: 'file',
    action: (req, res, next, name, file) => {
      assert(name, 'name is null');
      assert(file, 'file is null');
      numberOfFiles += 1;
    },
  },
  {
    event: 'error',
    action: (req, res, next, err) => {
      assert(err, 'err is null');
      assert.fail('error event must not be recieved');
    },
  },
  {
    event: 'aborted',
    action: (req, res, next) => {
      assert(next, 'next is null');
      assert.fail('aborted event must not be recieved');
    },
  },
  {
    event: 'end',
    action: (req, res, next) => {
      assert(next, 'next is null');
      endReached = true;
    },
  },
];

app.post('/event', formidable(null, events), req => callback(req));

test('parses multipart/form-data with files and recieve all events', (done) => {
  numberOfFields = 0;
  numberOfFilesBegin = 0;
  numberOfFiles = 0;
  endReached = false;

  send('multipart/form-data', {
    hello: 'world',
    foo: 'bar',
    number: 20161006,
    file1: fs.createReadStream(path.join(__dirname, '/fixtures/file1.txt')),
    file2: fs.createReadStream(path.join(__dirname, '/fixtures/file2.txt')),
  }, '/event');

  callback = (req) => {
    assert.equal(req.fields.hello, 'world');
    assert.equal(req.fields.foo, 'bar');
    assert.equal(req.fields.number, '20161006');

    fileTest(req.files.file1, 'You\'re file 1.\n');
    fileTest(req.files.file2, 'I\'m file 2.\n');

    assert.equal(numberOfFields, 3);
    assert.equal(numberOfFilesBegin, 2);
    assert.equal(numberOfFiles, 2);

    assert(endReached, 'The end event is not reached');

    done();
  };
});
