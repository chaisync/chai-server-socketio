// Check that client data has these properties
var validateClientData = function(data){
    if(data == null){
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
    
    if(!data.hasOwnProperty('data')){
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
        var id = [data.user, Object.keys(data.data[0])].join('_')
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