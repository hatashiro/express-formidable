'use strict';

const formidable = require('formidable');

function parse(opts) {
  const form = new formidable.IncomingForm();
  Object.assign(form, opts);

  return (req, res, next) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }

      Object.assign(req, { fields, files });
      next();
    });
  };
}

module.exports = parse;
exports.parse = parse; // backword compatibility
