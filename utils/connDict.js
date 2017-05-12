// Dictionary Object of (key=connection, value={user,device})
// dict {} holds all active connections for each user, 
// so socket.io can know where to broadcast to only those user devices
var dict = {}

module.exports = function(){
    this.addConnection = function(connection, user, device){
        dict[connection] = {"user":user, "deviceID": device}
    }
    
    this.findAllUserConnections = function(user){
        result = []
        for(connection in dict){
            if(dict[connection].user == user){
                result.push(connection)
            }
        }
        return result
    }

    this.deleteConnection = function(connection){
        if(dict.hasOwnProperty(connection)){
            delete dict[connection] 
            return true
        }
        return false
    }

    this.size = function(){
        return Object.keys(dict).length;
    }
}