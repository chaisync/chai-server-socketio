// This server uses express engine for http
var express = require('express')
var app = express()

// Express doesn't create standalong http server
// for websockets to bind to, make it manually
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)

// Database location
var fs = require('fs');

// Set port and start listening
app.set('port', process.env.PORT || 8080);
server.listen(app.get('port'), function(){
    console.log('Server started on port ' + app.get('port'));
});

// Route all incoming http 
app.get('/', function(req, res){
    var path = __dirname + '/index.html';
    res.sendFile(path);
})

// Serve all client websocket messages 
io.sockets.on('connection', function(socket){
    socket.on('send message', function(data){
        var msg = JSON.stringify(data);
        console.log("New message received: " + msg);
        // Send out to every client
        //io.sockets.emit('new message', data);
        // Send out to every client except originator
        
        // Save JSON to File 
        
        fs.appendFile('db.json', msg, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("New JSON data sent to file");
        });



        socket.broadcast.emit('new message', msg)
    })

    socket.on('disconnect', function(){
        console.log('Client disconnected')
    })
})



