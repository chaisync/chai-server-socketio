// Create a database/mapping structure 
var chaidb = [];

module.exports = function(mainFile){
    var main = mainFile;
    var test = '';
    var using = mainFile;
    
    // Setters
    this.setMain = function(main){
        this.main = main;
    }
    this.setTest = function(test){
        this.test = test;
    }
    this.setUsing = function(value){
        if (value == 'test'){
            this.using = this.test;
            return;
        }
        this.using = this.main;
    }

    // Getters
    this.getMain = function(){
        return this.main;
    }
    this.getTest = function(){
        return this.test;
    }
    this.getUsing = function(){
        return this.using;
    }
    this.toString = function(){
        return JSON.stringify(chaidb);
    }

    // Implement CRUD for database
    this.create = function(data){
        createData(null, 'create', data, message)
    }
    this.read = function(index){
        return readByIndex(null, 'read', index, message) 
    }
    this.update = function(index, data){
        updateDataByIndex(null, 'update', index, data, message)  
    }
    this.delete = function(index){
        deleteByIndex(null, 'delete', index, message)    
    }
    
    // Find
    this.findByUser = function(value){
        searchParam = value;
        return findByPredicate(null, 'filter', value, byUser, message)
    }
    this.findByTimestamp = function(value){
        searchParam = value;
        return findByPredicate(null, 'filter', value, byTimestamp, message)
    }

    // Find data elements according to filter predicate
    var searchParam = ''
    function findByPredicate(err, type, value, predicate, callback){
        if(err){
            console.log('error: ' + err);
            return null;
        }
        var result = chaidb.filter(predicate)
        callback(null, type+' result: ', JSON.stringify(result))
        return result;     
    }

    // Predicates used by Find
    function byUser(x){
        return x.user === searchParam
    }
    function byDevice(x){
        return x.deviceID === searchParam
    }
    function byReminderTime(x){
        return x.reminderTime === searchParam
    }
    function byTimestamp(x){
        return x.timestamp === searchParam
    }
}

// Create new data element in db and return its index
function createData(err, type, value, callback){
    if(err){
        console.log('error: ' + err);
        return -1;
    }
    chaidb.push(value);
    var index = chaidb.length-1;
    callback(null, type+' at index: ', index)
    return index;
}

// Read existing data element in db[i] and return contents
function readByIndex(err, type, index, callback){
    if(err){
        console.log('error: ' + err);
        return null;
    }
    if (index < 0 || index >= chaidb.length){
        console.log('error: ' + err);
        return null;
    }
    
    var data = chaidb[index];
    callback(null, type+' at index['+index+']: ', data)
    return data;
}

function updateDataByIndex(err, type, index, data, callback){
    if(err){
        console.log('error: ' + err);
        return -1;
    }
    if (index < 0 || index >= chaidb.length){
        console.log('error: ' + err);
        return null;
    }

    chaidb[index] = data;
    var newValue = chaidb[index];
    callback(null, type+' at index['+index+']: ', newValue)
    return newValue;
}

function deleteByIndex(err, type, index, callback){
    if(err){
        console.log('error: ' + err);
        return -1;
    }
    if(index < 0 || index >= chaidb.length){
        console.log('error: ' + err);
        return null;
    }

    chaidb.splice(index, 1);
    callback(null, type+' at index: ', index)
    return null;
}

function message(err, type, value){
    if(err){
        console.log('error: ' + err);
        return
    }
    console.log(type+' '+value);
}



