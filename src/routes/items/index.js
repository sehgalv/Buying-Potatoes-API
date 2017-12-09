const router = require('express').Router();
const db = require(`../../db/items.js`);
const routes = require(`../../routes`);
var oracledb = require('oracledb');
var error = routes.error;



exports.initRouter =  (connection,router) => {
    router.get('/items', (req, res) => {
        db.getItems(connection)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)        );

    });

    router.get('/items/:item_id', (req, res) => {
        db.getItem(connection, req.params.item_id)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)
        );
    });

    router.get('/items/stores/:store_id', (req, res) => {
        db.getItemsInStore(connection, req.params.store_id)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)
        );
    });

    router.get('/items/:item_id/stores/:store_id', (req, res) => {
        db.getItemInStore(connection, req.params.item_id,  req.params.store_id)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)
        );
    });

    router.post('/items', (req, res) => {
        db.postItem(connection, req.body)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res));
    });

    router.put('/items/:item_id/stores/:store_id', (req, res) => {
        db.putItemInStore(connection, req.params.item_id,  req.params.store_id, req.body)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res));
    });

    router.delete('/items/:item_id/stores/:store_id', (req, res) => {
        db.deleteItemInStore(connection, req.params.item_id,  req.params.store_id)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res));
    });
}
