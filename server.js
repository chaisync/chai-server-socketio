// This server uses express engine for http
var express = require('express')
var app = express()

// Express doesn't create stand-alone http server
// for websockets to bind to, make it manually
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)

// Set port and start listening
app.set('port', process.env.PORT || 8080);
server.listen(app.get('port'), function(){
    console.log('Server started on port ' + app.get('port'));
});

// set the static file location
app.use(express.static(__dirname + '/public'));

// Database
var chaiDictDB = require('./chaiDictDB.js')
var db = new chaiDictDB('./public/db.json')
db.loadFromFile()

// Include helper files
var util = require('./utils/util.js')
var connDict = require('./utils/connDict.js');
var conn = new connDict();

// Route all incoming http 
app.get('/', function(req, res){
    var path = __dirname + '/public/index.html';
    res.sendFile(path);
})

// Serve all client websocket messages 
io.sockets.on('connection', function(socket){
    //console.log('New connection: ' + socket.id)

    socket.on('send message', function(data){
        if(util.validateClientData(data) == false){  
            socket.emit('exception', 'Server received invalid data from client');
            return;
        }
        
        // Sync with database
        var dataObj = data
        dataObj.synced = true
        dataObj.reminder = "!fix a bug here!" // Android apps have a bug, delete this line after fix
        
        if(db.contains(dataObj)){
            db.update(dataObj)
        }
        else{
            db.create(dataObj)
        }

        console.log('Parsed Object to string to send to client: ' + JSON.stringify(dataObj))
        // Send to original client
        io.sockets.connected[socket.id].emit('new message', dataObj)
        // Send to all other client devices (FIX LATER)
        socket.broadcast.emit('new message', dataObj);  
    })

    socket.on('request update', function(clientData){
        if(util.validateClientData(clientData) == false){  
            socket.emit('exception', 'Server received invalid data from client');
            return;
        }

        // Add this connection to list of connections
        conn.addConnection(socket.id, clientData.user, clientData.deviceID)

        // Get server version of data
        if(db.contains(clientData) == false){
            db.create(clientData)            
        }
        var serverData = db.read(clientData)
        serverData.synced = false

        // Find out who is ahead and save their data 
        if (serverData.timestamp < clientData.timestamp){
            clientData.synced = true
            clientData.reminder = "!fix a bug here!" // Android apps have a bug, delete this line after fix
            db.update(clientData)
        }
        else{
            serverData.synced = true
            serverData.reminder = "!fix a bug here!" // Android apps have a bug, delete this line after fix
            db.update(serverData)
        }        

        // Send latest sync to client devices
        serverData = db.read(serverData)
        //console.log('Synced data to send back to client: ' + JSON.stringify(serverData))
        
        var connAry = conn.findAllUserConnections(serverData.user)
        for(var i=0; i<connAry.length; i++){
            io.sockets.connected[connAry[i]].emit('new message', serverData) 
        }
         
    })

    socket.on('disconnect', function(){
        conn.deleteConnection(socket.id)
        console.log('Disconnection : ' + socket.id);
    });

    socket.on('loopback test', function(data){
        console.log('server got ' + JSON.stringify(data))
        console.log('...looped back.')
        io.sockets.connected[socket.id].emit('new message', data)
    })

    socket.on('announce', function(clientIdent){
        conn.addConnection(socket.id, clientIdent.user, clientIdent.deviceID)
        console.log('announce: ' + JSON.stringify(clientIdent) + ' on ' + socket.id)
    })
})

exports.db = db