'use strict';

const request = require('request');

function send(type, data) {
  const opts = { url: 'http://localhost:1234' };

  if (type === 'application/x-www-form-urlencoded') {
    opts.form = data;
  } else if (type === 'multipart/form-data') {
    opts.formData = data;
  } else if (type === 'application/json') {
    opts.json = data;
  }

  request.post(opts);
}

module.exports = send;
