const router = require('express').Router();
const db = require(`../../db/lists.js`);
const routes = require(`../../routes`);
var oracledb = require('oracledb');
var error = routes.error;



exports.initRouter =  (connection,router) => {
    router.get('/list/:list_id', (req, res) => {
        db.getList(connection, req.params.list_id)
        .then(
            (res2) => {
                res.status(res2.status).json(res2.data)
            },
            (err) => error(err, res)
        );
    });

    router.post('/list', (req, res) => { 
        db.postItemToList(connection, req.body)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res));
    });

    router.delete('/list', (req, res) => { 
        db.deleteItemFromList(connection, req.body)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res));
    });

}
