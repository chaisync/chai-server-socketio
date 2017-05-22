// Use Chai-should style assertions
var chai = require('chai');
var chaiHttp = require('chai-http')
var should = chai.should();
chai.use(chaiHttp)

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
    describe('Empty dictionary', function(){
        it('should have size 0', function(){
            conn.size().should.be.equal(0)
        });
    });
    describe('Add an initial connection', function(){
        it('should return length 1', function(){
            var count = conn.size()
            conn.addConnection(user1, user1device1, connection1)
            conn.size().should.be.equal(count+1)
        });
    });
    describe('Delete sole connection', function(){
        it('should return true and length 0', function(){
            conn.deleteConnection(user1).should.be.equal(true)
            conn.size().should.be.equal(0)
            conn.deleteConnection(user1).should.be.equal(false)
            conn.deleteConnection(user2).should.be.equal(false)
        });
    });
    describe('Delete connections not in dictionary', function(){
        it('should return false', function(){
            conn.size().should.be.equal(0)
            conn.deleteConnection(user1).should.be.equal(false)
            conn.deleteConnection(user2).should.be.equal(false)
        });
    });
    describe('Find All User Connections', function(){
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
        chaiDB = require('../utils/chaiDictDB.js')
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

describe('Http specific tests', function(){
    var app;
    beforeEach(function(done){
        delete require.cache[require.resolve('../server')]; // Needed to start new server before each test
        process.stdout.write("        ");
        app = require('../server.js').app
        server = require('../server.js').server
        this.timeout(5000)  // Give server 5 sec to start-up (default 2 is not enough sometimes)
        done()
    })
    afterEach(function(done){
        server.close(function(){
            console.log('        Server closed on port ' + app.get('port'))
            done()
        })
    })
    describe('Ping server', function(){  
        it('should return status 200', function(done){
            chai.request(app)
            .get('/ping')
            .end(function(err, res){
                res.should.have.status(200)
                done()
            })
        });
        it('should have an empty body', function(done){
            chai.request(app)
            .get('/ping')
            .end(function(err, res){
                res.body.should.be.deep.equal({})
                done()
            })
        });
        it('should 404 everything else', function(done){
            chai.request(app)
            .get('/foo')
            .end(function(err, res){
                res.should.have.status(404)
                done()
            })
        })
    });
});

describe('Socket.io specific tests', function(){
    // Configure default socket client
    var io = require('socket.io-client')
    var socketUrl = 'http://localhost:8080';
    var options = {  
       transports: ['websocket'],
       'force new connection': true
    }
    
    const user1 = {'name':'bob@abc.com'}
    const origUser1Device1 = {
        "deviceID":"device1",
        "user":"testUser1",
        "reminderTime":"ahead",
        "timestamp":2}
    const origUser1Device2 = {
        "deviceID":"device2",
        "user":"testUser1",
        "reminderTime":"behind",
        "timestamp":1}
    const origUser2Device1 = {
        "deviceID":"device1",
        "user":"testUser2",
        "reminderTime":"something",
        "timestamp":1}

    beforeEach('start the server', function(done){
        delete require.cache[require.resolve('../server')]; // Needed to start new server before each test
        process.stdout.write("        ");
        app = require('../server.js').app
        server = require('../server.js').server
        this.timeout(5000)  // Give server 5 sec to start-up (default 2 is not enough sometimes)
        done()
    })
    afterEach('close the server', function(done){
        server.close(function(){
            process.stdout.write("        ");
            console.log('Server closed on port ' + app.get('port'))
            done()
        })
    })
    
    describe('emit echo from client', function(){
        it('should echo back same data from server as original client data', function(done){
            client1 = io.connect(socketUrl, options)

            client1.on('connect', function(data){
                client1.emit('echo', user1)
            })
            
            client1.on('new message', function(data){
                data.should.deep.equal(user1)
                client1.disconnect()
                done()
            })
        });
    });
    describe('emit send message from client', function(){
        it('should respond back from server same data, plus synced true', function(done){
            var origData1 = {
                "deviceID":"abcd",
                "user":"bob",
                "reminderTime":"something",
                "timestamp":1234}
            var syncedData1 = JSON.parse(JSON.stringify(origData1))
            
            syncedData1['synced'] = true // Expect server to also add this property
            syncedData1['reminder'] = "!fix a bug here!"

            client1 = io.connect(socketUrl, options)

            client1.on('connect', function(data){
                client1.emit('send message', origData1)
            })
            
            client1.on('new message', function(data){
                data.should.deep.equal(syncedData1)
                client1.disconnect()
                done()
            })
        })
    });
    describe('emit request update from client with new data', function(){
        it('should respond back from server same data plus synced=true to same user device', function(done){
            var syncedUser1Device1 = JSON.parse(JSON.stringify(origUser1Device1))
            syncedUser1Device1['synced'] = true // Expect server to also add this property
            syncedUser1Device1['reminder'] = "!fix a bug here!" // Expect server to add this 

            // User1 device1 sends data after 3 devices are connected
            client1 = io.connect(socketUrl, options)
            client1.on('connect', function(data){
                client2 = io.connect(socketUrl, options)
                client2.on('connect', function(){
                    client3 = io.connect(socketUrl, options)
                    client3.on('connect', function(){
                        client1.emit('request update', origUser1Device1)
                    })
                })
            })

            client1.on('new message', function(data){
                data.should.deep.equal(syncedUser1Device1)
                client1.disconnect()
                client2.disconnect()
                client3.disconnect()
                done()
            })
        })
    })
    describe('emit request update from client with new data', function(){
        it('should respond back from server same data plus synced=true to different user device', function(done){
            var syncedUser1Device1 = JSON.parse(JSON.stringify(origUser1Device1))
            syncedUser1Device1['synced'] = true // Expect server to also add this property
            syncedUser1Device1['reminder'] = "!fix a bug here!" // Expect server to add this 

            // User1 device1 sends data after 3 devices are connected
            client1 = io.connect(socketUrl, options)
            client1.on('connect', function(data){
                client2 = io.connect(socketUrl, options)
                client2.on('connect', function(){
                    client3 = io.connect(socketUrl, options)
                    client3.on('connect', function(){
                        client1.emit('request update', origUser1Device1)
                        client3.emit('request update', origUser2Device1)
                        client2.emit('request update', origUser1Device2)
                    })
                })

                client2.on('new message', function(data){
                    data.should.deep.equal(syncedUser1Device1)
                    client1.disconnect()
                    client2.disconnect()
                    client3.disconnect()
                    done()
                })
            })
        })
    })
    describe('emit request update from client with new data', function(){
        it('should not respond back from server to different user', function(done){
            var syncedUser1Device1 = JSON.parse(JSON.stringify(origUser1Device1))
            syncedUser1Device1['synced'] = true // Expect server to also add this property
            syncedUser1Device1['reminder'] = "!fix a bug here!" // Expect server to add this 
            var syncedUser2Device1 = JSON.parse(JSON.stringify(origUser2Device1))
            syncedUser2Device1['synced'] = true // Expect server to also add this property
            syncedUser2Device1['reminder'] = "!fix a bug here!" // Expect server to add this 

            // User1 device1 sends data after 3 devices are connected
            client1 = io.connect(socketUrl, options)
            client1.on('connect', function(data){
                client2 = io.connect(socketUrl, options)
                client2.on('connect', function(){
                    client2.emit('request update', origUser2Device1)
                    client1.emit('request update', origUser1Device1)
                })

                client2.on('new message', function(data){
                    data.should.deep.equal(syncedUser2Device1)
                    data.should.not.deep.equal(syncedUser1Device1)
                    client1.disconnect()
                    client2.disconnect()
                    done()
                })
            })
        })
    })
});