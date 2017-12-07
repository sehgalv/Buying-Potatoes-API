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
    return router;
}

