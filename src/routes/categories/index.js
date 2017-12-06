const categories = require('express').Router();

const all = require('./get');
categories.get('/', all);

const single = require('./_item_id/get');
categories.get('/:item_id', single);

// const add = require('./post');
// categories.post('/', add);
module.exports = categories;