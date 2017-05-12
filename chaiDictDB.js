util = require('./utils/util.js')
var fs = require('fs');
var fileName

// The database/mapping structure 
var chaidb = {};

module.exports = function(file){
    fileName = file;
    
    // Setters
    this.setFile = function(file){
        fileName = file;
    }

    // Getters
    this.getFile = function(){
        return fileName;
    }

    // Public function to check if id exists
    this.contains = function(data){
        var id = util.getId(data)
        return (chaidb.hasOwnProperty(id))
    }

    // Load from file
    this.loadFromFile = function(){
        var text = fs.readFileSync(fileName).toString('utf-8');
        if (text == ''){
            chaidb = {}
            return
        }
        chaidb = JSON.parse(text)
    }
    
    // Return db to string
    this.toString = function(){
        return JSON.stringify(chaidb)
    }

    // Return size of database
    this.size = function(){
        return Object.keys(chaidb).length
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
        return callback('error', err)
    }
    
    // If cannot find id, exit
    var id = util.getId(value)
    if(id == null){
        return callback('error', type + ' cannot create, id not valid')
    }

    // If id already exists, cannot create, exit
    if(chaidb.hasOwnProperty(id)){
        return callback('error', type + ' cannot create, id already exists')
    }
    chaidb[id] = value
    backup(null, saveFile)
    callback(null, type + 'd id[' + id + ']: ', value)
    return true;
}

// Read data element in db
function readById(err, type, value, callback){
    if(err){
        return callback('error', err)
    }

    // If cannot find id, exit
    var id = util.getId(value)
    if(id == null){
        return callback('error', type + ' cannot read, id not valid')
    }

    // If id exists return value
    if(chaidb.hasOwnProperty(id)){
        return chaidb[id];
    }
    else{
        return callback('error', type + ' tried but id[' + id + '] not found')
    }
}

// Update
function updateData(err, type, value, callback){
    if(err){
        return callback('error', err)
    }

    // If cannot find id, exit
    var id = util.getId(value)
    if(id == null){
        return callback('error', type + ' cannot update, id not valid')
    }

    // If id doesn't exist, cannot update, exit
    if(!chaidb.hasOwnProperty(id)){
        return callback('error', type + ' cannot update, id[' + id + '] not found')
    }

    chaidb[id] = value
    backup(null, saveFile)
    return true
}

// Delete
function deleteData(err, type, value, callback){
    if(err){
        return callback('error', err)
    }

    // If cannot find id, exit
    var id = util.getId(value)
    if(id == null){
        return callback('error', type + ' cannot delete, id not valid')
    }

    // If id doesn't exist, cannot delete, exit
    if(!chaidb.hasOwnProperty(id)){
        return callback('error', type + ' cannot delete, id does not exist')
    }

    delete chaidb[id]
    backup(null, saveFile)
    return true;
}

function message(err, type, value){
    if(err){
        //console.log('error: ' + type);
        return 'error: ' + type
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
    //console.log('Writing to db file now' + JSON.stringify(chaidb))
    fs.writeFile(fileName, JSON.stringify(chaidb), function(err) {
        if(err) {
            return console.log(err);
        }
    })
}