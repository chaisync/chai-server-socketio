// Check that client data has these properties
var validateClientData = function(data){
    if(data == null){
        return false
    }
    if(typeof data !== 'object'){
        return false
    } 
    if(JSON.stringify(data) === JSON.stringify({})){
        return false
    }
    if(!data.hasOwnProperty('user')){
        return false
    }

    if(!data.hasOwnProperty('deviceID')){
        return false
    }
    
    if(!data.hasOwnProperty('reminderTime')){
        return false
    }

    if(!data.hasOwnProperty('timestamp')){
        return false
    }
    return true
}

// Implement Id-creating function
var getId = function(data){
    if(validateClientData(data) == true){
        var id = [data.user, 'reminderTime'].join('_')
        return id
    }
    else{
        return null
    }
}

module.exports = {
    validateClientData: validateClientData,
    getId: getId
}