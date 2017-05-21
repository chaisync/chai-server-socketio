var express = require('express')
var app = express()
var server = require('http').createServer(app)
var routes = require('./routes/routes.js')
var io = require('./sockets/sockets.js').listen(server)

// Set port and start listening
app.set('port', process.env.PORT || 8080);
server.listen(app.get('port'), function(){
    console.log('Server started on port ' + app.get('port'));
});

// Set http routes and static files
app.use(express.static(__dirname + '/public'));
app.use('/', routes)

module.exports = { app, server, io }
