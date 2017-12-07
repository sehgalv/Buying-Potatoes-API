exports.initRouter = connection => {
    const router = require('express').Router();

    router.get('/', (req, res) => {
        res.json({
            message: 'hooray! welcome to our api'
        });
    });
    
    router.get('/teapot', (req, res) => {
        res.sendStatus(418);
    });

    const addresses = require('./addresses');
    addresses.initRouter(connection, router);
        
    const categories = require('./categories');
    categories.initRouter(connection, router);

    const items = require('./items');
    items.initRouter(connection, router);

    const stores = require('./stores');
    stores.initRouter(connection, router);

    const users = require('./users');
    users.initRouter(connection, router);
    return router;
}

/*
    Last resort error catcher to stop Oracle error messages from
    getting sent to the client (logs them to this program's console instead)
*/
exports.error = function error(err, res){
    console.log(`ERROR OBJECT: `, err)
    console.error(`Error in ${err.location}: `, err.err);
    if(!err.status)
        err.status = 500;
    if(err.toString().includes(`ORA`))
        res.status(err.status).json(
            `Something went wrong, see the API console if you want details, I'm not sending it to frontend`
        );
    else
        res.status(err.status).json(err.err);
};