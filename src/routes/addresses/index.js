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

    router.get('/addresses/:address_id', (req, res) => {
        db.getAddress(connection, req.params.address_id)
        .then(
            (res2) => res.status(res2.status).json(res2.data),
            (err) => error(err, res)
        );
    });
}




        // connection.execute("SELECT * FROM BP_ADDRESS", {}, {
        //     outFormat: oracledb.OBJECT // Return the result as Object
        // }, function (err, result) {
        //     if (err) {
        //         res.set('Content-Type', 'application/json');
        //         res.status(500).send(JSON.stringify({
        //             status: 500,
        //             message: "Error getting the addresses",
        //             detailed_message: err.message
        //         }));
        //     } else {
        //         res.contentType('application/json').status(200);
        //         res.send(JSON.stringify(result.rows));
        //     }
        // });