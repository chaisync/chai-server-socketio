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
        console.log('inside getMain' + this.main)
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
        searchParam = value.user;
        console.log('in findByUSer: ' + searchParam)
        return findByPredicate(null, 'filter', value, byUser, message)
    }
    this.findByTimestamp = function(value){
        searchParam = value.timestammp;
        return findByPredicate(null, 'filter', value, byTimestamp, message)
    }
    this.findByUserAndDataType = function(value){
        searchParam = value.user
        searchParam2 = Object.keys(value.data[0])
        console.log('in findByUserAndDataType ' +searchParam + ' '+searchParam2)
        return findByPredicate(null, 'filter', value, byUserAndDataType, message)
    }

    // Find data elements according to filter predicate
    var searchParam = ''
    var searchParam2 = ''
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
        console.log('x.user = ' +  x.user + 'searchParam = ' + searchParam)
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
    function byUserAndDataType(x){
        var match = (x.user === searchParam) && (Object.keys(x.data[0])[0] == searchParam2)
        console.log('match ?  ' + match)
        return match
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
    //console.log(type+' '+value);
}



