const router = require('express').Router();
const db = require(`../../db/addresses.js`);
const routes = require(`../../routes`);
var oracledb = require('oracledb');
var error = routes.error;



exports.initRouter =  (connection,router) => {
    router.get('/addresses', (req, res) => {
        db.getAddresses(connection)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)        );

    });

    router.get('/addresses/states', (req, res) => {
        db.getStates(connection)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)        );

    });

    router.get('/addresses/:address_id', (req, res) => {
        db.getAddress(connection, req.params.address_id)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)
        );
    });

    router.post('/addresses', (req, res) => { 
        db.postAddress(connection, req.body)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res));

    });
}
