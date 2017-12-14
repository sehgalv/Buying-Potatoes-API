const router = require('express').Router();
const db = require(`../../db/users.js`);
const routes = require(`../../routes`);
var oracledb = require('oracledb');
var error = routes.error;



exports.initRouter =  (connection,router) => {
    router.get('/users', (req, res) => {
        db.getUsers(connection)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)        );

    });

    router.get('/users/:user_id', (req, res) => {
        db.getUser(connection, req.params.user_id)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)
        );
    });

    router.get('/users/:user_id/lists', (req, res) => {
        db.getUserLists(connection, req.params.user_id)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)
        );
    });

    router.get('/users/:user_id/address', (req,res) => {
        db.getUserAddress(connection, req.params.user_id)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)
        );
    });

    router.post('/users/:user_id/list', (req, res) => {
        db.postListToUser(connection, req.params.user_id, req.body)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)        );

    });
}
