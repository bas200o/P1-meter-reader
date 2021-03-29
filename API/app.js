const express     = require('express');
const bodyParser  = require('body-parser');

const config      = require('./config.json');
const apiv1       = require('./routes/apiv1');
const dashboard   = require('./routes/dashboard')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' })); // Bug fixed: Angular app requires this to be parsed correcty!

app.all('*', function(req, res, next) { // middleware logging
	console.log(`[${new Date().toISOString()}] [${req.method}] ${req.url} has been invoked!`)
	next();
});

app.get('/', express.static('public'));

app.use('/api/v1', apiv1);
app.use('/dashboard', dashboard);

const http = app.listen(config.http.port, function() {
	console.log("Server started...");
});
