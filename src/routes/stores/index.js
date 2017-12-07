const router = require('express').Router();
const db = require(`../../db/stores.js`);
const routes = require(`../../routes`);
var oracledb = require('oracledb');
var error = routes.error;



exports.initRouter =  (connection,router) => {
    router.get('/stores', (req, res) => {
        db.getStores(connection)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)        );

    });

    router.get('/stores/:store_id', (req, res) => {
        db.getStore(connection, req.params.store_id)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)
        );
    });

    router.get('/stores/user/:user_id', (req, res) => {
        db.getStoreOwner(connection, req.params.user_id)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)
        );
    });
}
