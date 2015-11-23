/// <reference path="../lib.d.ts" />
import _ = require('underscore');
import express = require('express');
import formidable = require('formidable');

export interface IOption {
  encoding?: string;
  uploadDir?: string;
  keepExtensions?: boolean;
  maxFieldsSize?: number;
  maxFields?: number;
  hash?: boolean;
  multiples?: boolean;
}

export type Middleware = (option?: IOption) => express.RequestHandler;

export const parse: Middleware = (option = {}) => {
  return (req, res, next) => {
    let contentType = req.headers['content-type'];
    if (contentType && contentType.indexOf('multipart/form-data') >= 0) {
      let form = new formidable.IncomingForm();

      Object.keys(option).forEach(optKey => {
        form[optKey] = option[optKey];
      });

      let fields: {[name: string]: any} = {};

      function setOrAppend(name: string, value: any) {
        if (_.isUndefined(fields[name])) {
          fields[name] = value;
          return;
        }

        if (!_.isArray(fields[name])) {
          fields[name] = [fields[name]];
        }

        fields[name].push(value);
      }

      form
        .on('field', setOrAppend)
        .on('file', setOrAppend)
        .on('error', next)
        .on('end', () => {
          req.body = fields;
          next();
        });
      form.parse(req);
    } else {
      next();
    }
  };
};
