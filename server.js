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

// Database location
//var fs = require('fs'); //             <-- TODO: move to chaiDB.js module

// Database
//var chaiDB = require('./chaiDB.js'); //<-- array style db
//var db = new chaiDB('./chaidb.json');//<-- array style db
var chaiDictDB = require('./chaiDictDB.js')
var db = new chaiDictDB('./public/db.json')
db.loadFromFile()

// Connection list
var connList = require('./utils/connDict.js');
var conn = new connList();

// Route all incoming http 
app.get('/', function(req, res){
    var path = __dirname + '/public/index.html';
    res.setHeader("Content-Type", "application/json");
    res.sendFile(path);
    res.end(json)
})

// Serve all client websocket messages 
io.sockets.on('connection', function(socket){
    console.log('New connection: ' + socket.id)

    socket.on('send message', function(data){
        console.log('server got ' + data)
        socket.emit('new message', data)
    })

    // // Loop back test only, sends data to all clients
    // socket.on('send message', function(dataStr){
    //     if(dataStr == null){
    //         statusMsgToClient(1, 'No data received on server.');
    //         console.log('error: null string from client ' + dataStr)
    //         return;
    //     }
    //     // if(typeof dataStr === 'string'){
    //     //     dataObj = JSON.parse(dataStr)
    //     // } 
    //     console.log('the type is: '+typeof dataStr)
    //     console.log(JSON.parse(dataStr))

    //     // Sync with database
    //     if(db.contains(dataObj)){
    //         db.update(dataObj)
    //     }
    //     else{
    //         db.create(dataObj)
    //     }
    //     dataObj.synced = true

    //     // Send to original client
    //     io.sockets.connected[socket.id].emit('new message', JSON.stringify(dataObj))
    //     // Send to all other client devices (FIX LATER)
    //     socket.broadcast.emit('new message', JSON.stringify(dataObj));
    // })

    socket.on('request update', function(clientData){
        // console.log(clientData.user + ' requests update on ' + socket.id);
        
        // if(clientData == null){
        //     statusMsgToClient(1, 'No data received on server.');
        //     return;
        // }
        
        // latestData(clientData, function(){
        //     // Emit update to original client
        //     io.sockets.connected[socket.id].emit('send update', latestData)   
        //     conn.set(latestData.user, latestData.deviceID, socket.id)
        //     console.log('Connections: ' + JSON.stringify(conn.get()))
        //     // TODO: broadcast to all user-devices
        // })

        // var latestData = function(clientData, callback){
        //     // Compare device data with server data
        //     if(db.contains(clientData)){
        //         var serverVersion = db.read(clientData)
                
        //         // If server behind 
        //         if (serverVersion.timestamp < clientData.timestamp){
        //             clientData.synced = true
        //             db.update(clientData)
        //             callback()
        //             return clientData
        //         }
        //         else{  // Client behind
        //             serverVersion.synced = true
        //             db.update(serverVersion)
        //             callback()
        //             return serverVersion
        //         }  
        //     }
        //     else{
        //         clientData.synced = true
        //         callback()
        //         return clientData
        //     }
        // }
    })

    // Save to database
    function saveToDatabase(err, data, callback){
        if(err){    
            return console.log(err);
        }

        console.log("New message received: " + JSON.stringify(data));
        
        // Push data to database
        db.create(data);
        console.log("Data added to DB");
        callback(null, ['Data entered to database', data.timestamp]);
        
        // Backup database to file
        fs.writeFile('public/db.json', db.toString(), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("Database file updated.");
        });
    }

    // Client requested data refresh from database
    socket.on('get db entry from server', function(timestamp){
        getDataByTimestamp(timestamp, sendDataToClient)
    })
    
    socket.on('disconnect', function(){
        console.log('disconnect: ' + Object.keys(io.sockets.sockets));
    });

    socket.on('loopback test', function(data){
        console.log('server got ' + data)
        socket.emit('loopback response', data)
    })

    // Search db by timestamp and return data element to client
    function getDataByTimestamp(timestamp, callback){
        console.log('Database entry requested: ' + JSON.stringify(timestamp));
        var result = db.findByTimestamp(timestamp);
        callback(null, result);
               
        //findIndexByKeyValue(chaidb, 'timestamp', data, sendDataToClient);
    }

    // Search array for index of given key  
    function findIndexByKeyValue(obj, key, value, replyToClient){
        for (var i = 0; i < obj.length; i++) {
            console.log('key:' + key + ' value:' + obj[i][key]);
            if (obj[i][key] == value) {
                return sendDataToClient(null, obj[i]);
            }
        }
        return sendDataToClient(1);
    }

    // Reply to client with db[i], or empty value if not found
    function sendDataToClient(err, data){
        if(err){
            socket.emit('send data to client', [null]);
            return;
        }
        console.log('Data to client: '+ JSON.stringify(data));
        socket.emit('send data to client', JSON.stringify(data));
    }

    // Send status confirmation message to client
    function statusMsgToClient(err, message){
        if(err){
            socket.emit('error', message);
            return;
        }
        socket.emit('success', message);
    }

    // Backup database to file
    function backupDatabase(){
        // Backup database to file
        fs.writeFile('public/db.json', db.toString(), function(err) {
            if(err) {s
                return console.log(err);
            }
            console.log("Database file updated.");
        });
    }
})

exports.db = db