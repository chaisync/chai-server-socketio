// Hash map of (key=user, value=[device,connection])
var dict = {}

module.exports = function(){
    this.set = function(user, device, connection){
        var key = user
        var value = {device:device, connection:connection}
        if(dict[key] == null){
            var ary = []
            ary.push(value)
            dict[key] = ary
            //console.log('INIT: ' + key + ': ' +JSON.stringify(dict[key]))
            return
        }

        var index = findIndexOfDevice(key, device)
        //console.log('key ' + key + 'device ' + device + ' at index ' + index)
        if(index == -1){
            dict[key].push(value)
            //console.log('ADD: ' + key + ': ' +JSON.stringify(dict[key]))
            return
        }
        dict[key][index].connection = connection
        //console.log('UPDATE: ' + key + ': ' +JSON.stringify(dict[key]))
    }

    this.get = function(key){
        if (dict[key] == null){
            return ""
        }
        //console.log('Get returns: ' +JSON.stringify(dict[key]))
        return dict[key]
    }
}

function getKey(value){
    return [value.user, value.device].join('_')
}

function findIndexOfDevice(key, device){
    for(var i=0; i<dict[key].length; i++){
        //console.log('Device at ' + i + ' is ' + dict[key][i].device)
        if (dict[key][i].device == device){
            return i
        }
    }
    return -1
}
