const items = require('express').Router();

const all = require('./get');
items.get('/', all);

const single = require('./_store_id/get');
items.get('/:store_id', single);

const add = require('./_store_id/post');
items.post('/:store_id', add);
module.exports = items;