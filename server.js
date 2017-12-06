const app = require('express')();
const routes = require('./src/routes');
var bodyParser = require('body-parser');
var oracledb = require('oracledb');
const config = require(`./src/config/dbconfig.js`);

var port = 3000;


oracledb.getConnection(config,
    (err, connection) => {
        console.log(config);
        if (err) {
            console.error(err.message);
            return;// callback(err);
        }
        if(connection) {
            console.log("connection: "+connection);
            return;
        }
        // callback(null, connection);
        console.log(`Connected to database`);

        app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
            res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
            console.log('Something is happening.');
            next(); // make sure we go to the next routes and don't stop here
        });

        app.use(bodyParser.json());
        app.use('/api', routes.initRouter(connection));

        app.listen(port, () => {
            console.log('listening on port 3000');
        });
    });


