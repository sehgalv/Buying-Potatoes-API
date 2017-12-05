const routes = require('express').Router();

routes.get('/', (req, res) => {
    res.status(200).json({message: 'hooray! welcome to our api'});
});

const addresses = require('./addresses');
routes.use('/addresses', addresses);

module.exports = routes;
