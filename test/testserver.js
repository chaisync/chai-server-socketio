// Demo Socket.io test server
var io = require('socket.io').listen(5000)

io.on('connection', function (socket) {
    console.log('server got a connection: ' + socket.id)
    socket.on('loopback test', function(user){
        console.log('server got ' + user)
        socket.emit('same thing back', user)
    })
});