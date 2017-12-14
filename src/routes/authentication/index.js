const router = require('express').Router();
const db = require(`../../db/users.js`);
const routes = require(`../../routes`);
var oracledb = require('oracledb');
var error = routes.error;



exports.initRouter =  (connection,router) => {
    router.post('/authentication/verify', (req, res) => {
        console.log("gets in here");
        db.getUserLoginVerification(connection, req.body)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)
        )
    });

}
