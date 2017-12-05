const addresses = require('express').Router();
const all = require('./get');
addresses.get('/', all);

module.exports = addresses;