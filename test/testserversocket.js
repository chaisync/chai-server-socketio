function makeServer() {
    var express = require('express');
    var app = express();
    
    // Set port and start listening
    var server = app.listen(3001, function () {
        var port = server.address().port;
        console.log('        Server listening at port ' + port);
    });
    var io = require('socket.io').listen(server)
    
    return io;
}
module.exports.makeServer = makeServer;
