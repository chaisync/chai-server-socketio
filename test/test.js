// Use Chai-should style assertions
var chai = require('chai');
var should = chai.should();

describe('Http specific tests', function(){
    describe('#test1', function(){
        it('should test something http');
    });
});

describe('Socket.io Server specific tests', function(){
    var db = require('../server.js').db
    var io = require('socket.io-client')
    //var socketUrl = 'http://localhost:5000';
    var socketUrl = 'http://localhost:8080';
    var options = {  
        transports: ['websocket'],
        'force new connection': true
    };
    
    describe.only('socket on loopback test', function(){
        it('should respond back same data as original client emit data', function(done){
            var user1 = {'name':'bob@abc.com'}
            client1 = io.connect(socketUrl, options)

            client1.on('connect', function(data){
                client1.emit('loopback test', user1)
            })
            
            client1.on('loopback response', function(data){
                data.should.deep.equal(user1)
                client1.disconnect()
                done()
            })
        });
    });
    describe('socket on send message', function(){
        it('should respond back data with {synced:true}', function(done){
            var origData1 = {
                "deviceID":"abcd",
                "user":"bob",
                "reminderTime":"something",
                "timestamp":1234}
            var syncedData1 = JSON.parse(JSON.stringify(origData1))
            
            syncedData1['synced'] = true
            
            client1 = io.connect(socketUrl, options)

            client1.on('connect', function(data){
                client1.emit('send message', JSON.stringify(origData1))
            })
            
            client1.on('new message', function(data){
                JSON.parse(data).should.deep.equal(syncedData1)
                //console.log(db.read(origData1))
                client1.disconnect()
                done()
            })
        });
    });
});

describe('Connection Dictionary specific tests', function(){
    var connDict = require('../utils/connDict.js')
    var conn = new connDict()
    var user1, user2
    var user1device1, user1device2, user2device1, user2device2
    var connection1, connection2, connection3, connection4
    before(function(){
        user1 = 'ann'
        user2 = 'bob'
        user3 = 'zac'
        user1device1 = 'Phone1'
        user1device2 = 'Tablet1'
        user2device1 = 'Phone2'
        user2device2 = 'Tablet2' 
        connection1 = 'a1111111'
        connection2 = 'b2222222'
        connection3 = 'c3333333'
        connection4 = 'd4444444'
    })
    describe('1 Empty dictionary', function(){
        it('should have size 0', function(){
            conn.size().should.be.equal(0)
        });
    });
    describe('2 Add an initial connection', function(){
        it('should return length 1', function(){
            var count = conn.size()
            conn.addConnection(user1, user1device1, connection1)
            conn.size().should.be.equal(count+1)
        });
    });
    describe('3 Delete sole connection', function(){
        it('should return true and length 0', function(){
            conn.deleteConnection(user1).should.be.equal(true)
            conn.size().should.be.equal(0)
            conn.deleteConnection(user1).should.be.equal(false)
            conn.deleteConnection(user2).should.be.equal(false)
        });
    });
    describe('4 Delete connections not in dictionary', function(){
        it('should return false', function(){
            conn.size().should.be.equal(0)
            conn.deleteConnection(user1).should.be.equal(false)
            conn.deleteConnection(user2).should.be.equal(false)
        });
    });
    describe('5 Find All User Connections', function(){
        it('should return array of connections', function(){
            conn.addConnection(connection1, user1, user1device1)
            conn.addConnection(connection2, user1, user1device2)
            conn.addConnection(connection3, user2, user2device1)
            resultUser1 = [connection1, connection2]
            resultUser2 = [connection3]
            resultUser3 = []

            conn.size().should.be.equal(3)
            conn.findAllUserConnections(user1).should.be.deep.equal(resultUser1)
            conn.findAllUserConnections(user2).should.be.deep.equal(resultUser2)
            conn.findAllUserConnections(user3).should.be.deep.equal(resultUser3)
        });
    });
});

describe('ChaiDictDB specific tests', function(){
    var mainFile
    var testFile
    var chaiDB
    var db
    var validdata1, validdata2, baddata1
    var util
    before(function(){
        mainFile = './test/test_doNotModify.json'
        testFile = './test/test.json'
        chaiDB = require('../chaiDictDB.js')
        util = require('../utils/util.js')
    })
    beforeEach(function(){
        db = new chaiDB(testFile)
        validdata1 = {
            "deviceID":"abcd",
            "user":"bob",
            "reminderTime":"something",
            "timestamp":1234}
        validdata2 = {
            "deviceID":"efgh",
            "user":"jan",
            "reminderTime":"something",
            "timestamp":5678}
        baddata1 = {
            "deviceID":"abcd",
            //"user":"bob",
            "reminderTime":"something",
            "timestamp":1234}
    });
    describe('Get file', function(){    
        it('should be the current file path and name', function(){         
            db.getFile().should.be.equal(testFile)
            db.getFile().should.not.be.equal(mainFile)
        });
    });
    describe('Set file', function(){    
        it('should change the file path and name', function(){         
            db.setFile(mainFile)
            db.getFile().should.be.equal(mainFile)
            db.setFile(testFile)
            db.getFile().should.be.equal(testFile)
        });
    });
    describe('Contains data', function(){    
        it('should return true if data exists in db', function(){         
            db.create(validdata1)
            db.contains(validdata1).should.equal(true)
        });
        it('should return false if data not in db', function(){         
            db.delete(validdata1)
            db.contains(validdata1).should.equal(false)
        });
    });
    describe('Create data', function(){    
        it('should create return true on valid data', function(){         
            db.create(validdata1).should.be.equal(true)
            db.contains(validdata1).should.be.equal(true)
            db.contains(validdata2).should.be.equal(false)
        });
        it('should return error message on duplicate data', function(){      
            var message = 'error: create cannot create, id already exists'
            db.create(validdata1).should.be.equal(message)
        });
        it('should return error message on invalid data', function(){
            var message = 'error: create cannot create, id not valid'   
            db.create(baddata1).should.be.equal(message)
        });
    });
    describe('Read data', function(){    
        it('should return value on valid data request', function(){
            db.read(validdata1).should.be.deep.equal(validdata1)
        });
        it('should return error message on incorrect or missing properties', function(){
            var message = 'error: read cannot read, id not valid'
            db.read(null).should.be.equal(message)
            db.read(baddata1).should.be.equal(message)
        });
        it('should return error message on not in database', function(){
            var id = util.getId(validdata2)
            var message = 'error: read tried but id['+ id +'] not found'
            db.read(validdata2).should.be.equal(message)
        });
    });
    describe('Update data', function(){    
        it('should return true on valid data', function(){
            var value = 5555
            validdata1.timestamp = value
            db.update(validdata1).should.equal(true)
            db.read(validdata1).timestamp.should.equal(value)
        });
        it('should return error message on missing or incorrect properties', function(){
            var message = 'error: update cannot update, id not valid'
            db.update(null).should.be.equal(message)
            db.update(baddata1).should.be.equal(message)
        });
        it('should return error message on not in database', function(){
            var id = util.getId(validdata2)
            var message = 'error: update cannot update, id['+ id +'] not found'
            db.update(validdata2).should.be.equal(message)
        });
    });
    describe('Delete data', function(){    
        it('should return true on valid data', function(){
            db.create(validdata2)
            db.delete(validdata2).should.equal(true)
        });
        it('should return error message on missing or incorrect properties', function(){
            var message = 'error: delete cannot delete, id not valid'
            db.delete(baddata1).should.equal(message)
        });
        it('should return error message on not in database', function(){
            var message = 'error: delete cannot delete, id does not exist'
            db.delete(validdata2).should.equal(message)
        });
    });
    describe('Load from file', function(){
        it('should read a blank file and create empty JS Object', function(){
            var fileName = 'test/testdb_noObject.json'
            db.setFile(fileName)
            db.loadFromFile()
            db.size().should.be.equal(0)
        })
        it('should read a file with empty object and parse into JS Object', function(){
            var fileName = 'test/testdb_noObject.json'
            db.setFile(fileName)
            db.loadFromFile()
            db.size().should.be.equal(0)
        })
        it('should read a string from a file and parse into JS Object', function(){
            var fileName = 'test/testdb_doNotModify.json'
            db.setFile(fileName)
            db.loadFromFile()
            var element1 = {"deviceID":"abcd","user":"rick","reminderTime":"something","timestamp":5555}
            var element2 = {"deviceID":"efgh","user":"nina","reminderTime":"something","timestamp":5678}
            db.size().should.be.equal(2)
            db.read(element1).should.be.deep.equal(element1)
            db.read(element2).should.be.deep.equal(element2)
        })
    })
    afterEach(function(){
    });
    after(function(){
    });
});

describe('Utility specific tests', function(){
    var util
    var data1, data2, data3, data4, data5, data6
    before(function(){
        util = require('../utils/util.js')
        data1 = null
        data2 = {}
        data3 = {"user":"a", "data":"a","timestamp":1} 
        data4 = {"deviceID":"a", "data":"a","timestamp":1} 
        data5 = {"user":"a", "deviceID":"a","timestamp":1} 
        data6 = {"user":"a", "deviceID":"a","data":"a"} 
        validdata = {
            "deviceID":"iPad-4603488219",
            "user":"angie@cpp.edu",
            "reminderTime":"something",
            "timestamp":1494120903705}
    })
    beforeEach(function(){
    });
    describe('Validate client data', function(){    
        it('should be true on valid input data', function(){         
            util.validateClientData(validdata).should.be.equal(true)
        });
        it('should be false on invalid input data', function(){
            util.validateClientData(data1).should.be.equal(false)
            util.validateClientData(data2).should.be.equal(false)
            util.validateClientData(data3).should.be.equal(false)
            util.validateClientData(data4).should.be.equal(false)
            util.validateClientData(data5).should.be.equal(false)
            util.validateClientData(data6).should.be.equal(false)
        });
    });
    describe('Get ID from input data', function(){    
        it('should be user_dataType on valid data', function(){
            var validId = validdata.user + '_reminderTime'
            util.getId(validdata).should.be.equal(validId)        
            util.getId(validdata).should.be.equal('angie@cpp.edu_reminderTime')
        });
        it('should be null on invalid data', function(){         
            should.not.exist(util.getId(data1))
            should.not.exist(util.getId(data2))
            should.not.exist(util.getId(data3))
            should.not.exist(util.getId(data4))
            should.not.exist(util.getId(data5))
            should.not.exist(util.getId(data6))
        });  
    });
    afterEach(function(){
    });
    after(function(){
    });
});

// Describe structure of test suite
// describe('Database tests', function(){
//     var chaiDB = require('../chaiDB.js');
//     var db = new chaiDB('../public/testdb.json');
//     var foo;
//     var chunks;
//     var foo;
//     before(function(){
//         foo = 'peanut';
//     });
//     beforeEach(function(){   
//     });
//     describe('#test1', function(){
//         it('should be length 8', function(){
//             // Add test data to database
//             var chunk1 = {deviceID: "Android Tab", user: "angie@cpp.edu", reminderTime: "5:00pm",timestamp: 1};
//             var chunk2 = {deviceID: "Android Phone", user: "angie@cpp.edu", reminderTime: "2:00pm",timestamp: 1};
//             var chunk3 = {deviceID: "Apple iPhone", user: "angie@cpp.edu", reminderTime: "1:30pm",timestamp: 5};
//             var chunk4 = {deviceID: "Apple iPad", user: "angie@cpp.edu", reminderTime: "8:00pm",timestamp: 10};
//             var chunk5 = {deviceID: "Android Tab", user: "bryan@cpp.edu", reminderTime: "4:00pm",timestamp: 2};
//             var chunk6 = {deviceID: "Android Phone", user: "bryan@cpp.edu", reminderTime: "12:01pm",timestamp: 2};
//             var chunk7 = {deviceID: "Apple iPhone", user: "bryan@cpp.edu", reminderTime: "6:01pm",timestamp: 2};
//             var chunk8 = {deviceID: "Apple iPad", user: "bryan@cpp.edu", reminderTime: "6:01pm",timestamp: 2};
//             var chunks = [chunk1,chunk2,chunk3,chunk4,chunk5,chunk6,chunk7,chunk8];
//             chunks.forEach(function(entry){
//                 db.create(entry);
//             })

//             chunks.length.should.be.equal(8);
//         })
//     });
//     describe('#test2', function(){
//         it('should be a string', function(){
//             foo.should.be.a.string;
//         });
//     });
// });
