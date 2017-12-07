const router = require('express').Router();
const db = require(`../../db/categories.js`);
const routes = require(`../../routes`);
var oracledb = require('oracledb');



exports.initRouter =  (connection,router) => {
    router.get('/categories', (req, res) => {
        console.log("gets here");        
        db.getCategories(connection)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)        );

    });

    router.get('/categories/:item_id', (req, res) => {
        console.log("inside item's category");
        db.getItemCategories(connection, req.params.item_id)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)
        );
    });
}

