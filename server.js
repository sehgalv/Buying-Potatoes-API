const app = require('express')();
const routes = require('./src/routes');
var bodyParser = require('body-parser');
var oracledb = require('oracledb');
const config = require(`./src/config/config.json`);

var port = 3000;


oracledb.getConnection(config,
    (err, connection) => {
        if (err) {
            console.error(err.message);
            return;// callback(err);
        }
        console.log(`Connected to database`);

        app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
            res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
            next(); // make sure we reach next route
        });

        app.use(bodyParser.json());
        app.use('/api', routes.initRouter(connection));

        app.listen(port, () => {
            console.log(`listening on port '${port}'`);
        });
    });


