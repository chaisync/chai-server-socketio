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
var fs = require('fs'); //             <-- TODO: move to chaiDB.js module

// Database
var chaiDB = require('./chaiDB.js');
var db = new chaiDB('./chaidb.json');
//db.setUsing('test');
//console.log('using '+db.getUsing());

// Connection list
var connList = require('./syncList.js');
var conn = new connList();

// Route all incoming http 
app.get('/', function(req, res){
    var path = __dirname + '/public/index.html';
    res.sendFile(path);
})

// Serve all client websocket messages 
io.sockets.on('connection', function(socket){
    console.log('connection: ' + Object.keys(io.sockets.sockets));
    socket.on('send message', function(data){
        if(data == null){
            statusMsgToClient(1, 'No data received on server.');
            return;
        }
        saveToDatabase(null, data, statusMsgToClient);

        // TO DO: change emit to send only to user's devices
        socket.broadcast.emit('new message', data)
    })

    // Save to database
    function saveToDatabase(err, data, callback){
        if(err){    
            return console.log(err);
        }

        var msg = JSON.stringify(data);
        console.log("New message received: " + msg);
        
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

    
})

