/*
 * Static Express server to serve Angular 2 Front-End (Used for mobile testing)
 */

var port = 1421;

var express = require('express');
var app     = express();
var history = require('connect-history-api-fallback');

// Default to index.html
app.use(history());

// Static server
app.use(express.static('./'));

app.listen(port, function() {
	console.log('Front-end listening on *:' + port);
});
