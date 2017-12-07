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
            (res2) => {
                // var o = {} // empty Object
                // var key = 'ITEM';
                // o[key] = []; // empty Array, which you can push() values into
                
                
                // var data = {
                //     ITEM_ID: '1450632410296',
                //     ITEM_NAME: '76.36731:3.4651554:0.5665419',
                //     ITEM_DESCRIPTION: '76.36731:3.4651554:0.5665419',
                // };
                
                // o[key].push(data);
                // o[key].push(data2);
                res.status(res2.status).json(res2.data)
            },
            (err) => error(err, res)
        );
    });

}
