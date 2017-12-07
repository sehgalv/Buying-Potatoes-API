const router = require('express').Router();
const db = require(`../../db/categories.js`);
const routes = require(`../../routes`);
var oracledb = require('oracledb');
var error = routes.error;



exports.initRouter =  (connection,router) => {
    router.get('/categories', (req, res) => {
        db.getCategories(connection)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)        );

    });

    router.get('/categories/:item_id', (req, res) => {
        db.getItemCategories(connection, req.params.item_id)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)
        );
    });
}

