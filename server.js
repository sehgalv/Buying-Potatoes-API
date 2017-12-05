const app = require('express')();
const routes = require('./src/routes');
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api', routes);

app.listen(3000, () => {
    console.log('listening on port 3000');    
});
