util = require('./util.js')
var fs = require('fs');
var fileName

// The database/mapping structure 
var chaidb = {};

module.exports = function(main){
    fileName = main;
    
    // Setters
    this.setMain = function(main){
        fileName = main;
    }

    // Getters
    this.getMain = function(){
        return fileName;
    }

    // Public function to check if id exists
    this.contains = function(data){
        var id = util.getId(data)
        return (chaidb.hasOwnProperty(id))
    }

    // Return db to string
    this.toString = function(){
        return JSON.stringify(chaidb)
    }

    // 
    this.loadFromFile = function(){
        var text = fs.readFileSync(fileName).toString('utf-8');
        chaidb = JSON.parse(text)
    }

    // Implement CRUD for database
    this.create = function(data){
        return createData(null, 'create', data, message)
    }
    this.read = function(data){
        return readById(null, 'read', data, message) 
    }
    this.update = function(data){
        return updateData(null, 'update', data, message)  
    }
    this.delete = function(data){
        return deleteData(null, 'delete', data, message)    
    }
}

// Create new data element in db
function createData(err, type, value, callback){
    if(err){
        callback('error', err)
        return false;
    }
    
    // If cannot find id, exit
    var id = util.getId(value)
    if(id == null){
        callback('error', type + ' cannot create, id not valid')
        return false;
    }

    // If id already exists, cannot create, exit
    if(chaidb.hasOwnProperty(id)){
        callback('error', type + ' cannot create, id already exists')
        return false;
    }

    chaidb[id] = value
    backup(null, saveFile)
    //console.log(type + 'id[' + id + ']: ', value)
    callback(null, type + 'd id[' + id + ']: ', value)
    return true;
}

// Read data element in db
function readById(err, type, value, callback){
    if(err){
        callback('error', err)
        return null;
    }

    // If cannot find id, exit
    var id = util.getId(value)
    if(id == null){
        callback('error', type + ' cannot read, id not valid')
        return null;
    }

    // If id exists return value
    if(chaidb.hasOwnProperty(id)){
        callback(null, type + ' ' + id)
        return chaidb[id];
    }
    else{
        callback('error', type + ' tried but id[' + id + '] not found')
        return null
    }
}

// Update
function updateData(err, type, value, callback){
    if(err){
        callback('error', err)
        return false;
    }

    // If cannot find id, exit
    var id = util.getId(value)
    if(id == null){
        callback('error', type + ' cannot update, id not valid')
        return false;
    }

    // If id doesn't exist, cannot update, exit
    if(!chaidb.hasOwnProperty(id)){
        callback('error', type + ' cannot update, id does not exist')
        return false;
    }

    chaidb[id] = value
    backup(null, saveFile)
    //console.log(type + 'id[' + id + ']: ', value)
    callback(null, type + 'd id[' + id + ']: ', value)
    return true;
}

// Delete
function deleteData(err, type, value, callback){
    if(err){
        callback('error', err)
        return false;
    }

    // If cannot find id, exit
    var id = util.getId(value)
    if(id == null){
        callback('error', type + ' cannot delete, id not valid')
        return false;
    }

    // If id doesn't exist, cannot delete, exit
    if(!chaidb.hasOwnProperty(id)){
        callback('error', type + ' cannot delete, id does not exist')
        return false;
    }

    delete chaidb[id]
    backup(null, saveFile)
    callback(null, type + 'ed id[' + id + ']: ', value)
    return true;
}

function message(err, type, value){
    if(err){
        console.log('error: ' + type);
        return
    }
    //console.log(type+' '+JSON.stringify(value));
}

// Backup database to file
function backup(err, callback){
    if(err){
        console.log(err)
    }
    callback()
}

// Save db Object to file specified in main location 
function saveFile(){
    fs.writeFile(fileName, JSON.stringify(chaidb), function(err) {
        if(err) {
            return console.log(err);
        }
    })
}

// Load db Object from file specified in main location 
// function readContent(callback){
//     fs.readFile('public/junk.json', function (err, data) {
//         if (err) { 
//             return callback(err)
//         }
//         callback(null, data)
//     });
// }

// function load(file, callback){
//     var contents = callback(file)
//     return contents
// }