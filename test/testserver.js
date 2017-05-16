function makeServer() {
    var express = require('express');
    var app = express();

    app.get('/', function (req, res) {
        res.status(200).send('ok');
    });

    var server = app.listen(3000, function () {
        var port = server.address().port;
        console.log('Server listening at port ' + port);
    });

    return server;
}
module.exports.makeServer = makeServer;

// // Demo Socket.io test server
// var io = require('socket.io').listen(5000)

// io.on('connection', function (socket) {
//     console.log('server got a connection: ' + socket.id)
//     socket.on('loopback test', function(user){
//         console.log('server got ' + user)
//         socket.emit('same thing back', user)
//     })
// });