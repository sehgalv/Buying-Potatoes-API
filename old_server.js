
var express = require('express');
const app = express();
var oracledb = require('oracledb');
const config = require(`./src/config/dbconfig.js`);
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var connAttrs = {
    "user": config.user,
    "password": config.password,
    "connectString": config.connectString
}

app.get('/addresses', function(req, res) {
    "use strict";
    oracledb.getConnection(connAttrs, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }

        connection.execute("SELECT * FROM BP_ADDRESS;", {}, {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err) {
                res.set('Content-Type', 'application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error getting the addresses",
                    detailed_message: err.message
                }));
            } else {
                res.contentType('application/json').status(200);
                res.send(JSON.stringify(result.rows));
            }
            // Release the connection
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /addresses : Connection released");
                    }
                });
        });
    });
});


app.listen(3000, () => {
    console.log('listening on port 3000');    
});
