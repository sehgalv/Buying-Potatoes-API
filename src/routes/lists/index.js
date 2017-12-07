const router = require('express').Router();
const db = require(`../../db/lists.js`);
const routes = require(`../../routes`);
var oracledb = require('oracledb');
var error = routes.error;



exports.initRouter =  (connection,router) => {
    router.get('/lists', (req, res) => {
        db.getLists(connection)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)        );

    });

    router.get('/lists/:list_id', (req, res) => {
        db.getList(connection, req.params.list_id)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)
        );
    });

}
