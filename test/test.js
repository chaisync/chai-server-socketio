// Use Chai-should style assertions
var chai = require('chai');
var should = chai.should();

// Describe structure of test suite
describe('Database tests', function(){
    var chaiDB = require('../chaiDB.js');
    var db = new chaiDB('../public/testdb.json');
    var foo;
    var chunks;
    var foo;
    before(function(){
        foo = 'peanut';
    });
    beforeEach(function(){   
    });
    describe('#test1', function(){
        it('should be length 8', function(){
            // Add test data to database
            var chunk1 = {deviceID: "Android Tab", user: "angie@cpp.edu", reminderTime: "5:00pm",timestamp: 1};
            var chunk2 = {deviceID: "Android Phone", user: "angie@cpp.edu", reminderTime: "2:00pm",timestamp: 1};
            var chunk3 = {deviceID: "Apple iPhone", user: "angie@cpp.edu", reminderTime: "1:30pm",timestamp: 5};
            var chunk4 = {deviceID: "Apple iPad", user: "angie@cpp.edu", reminderTime: "8:00pm",timestamp: 10};
            var chunk5 = {deviceID: "Android Tab", user: "bryan@cpp.edu", reminderTime: "4:00pm",timestamp: 2};
            var chunk6 = {deviceID: "Android Phone", user: "bryan@cpp.edu", reminderTime: "12:01pm",timestamp: 2};
            var chunk7 = {deviceID: "Apple iPhone", user: "bryan@cpp.edu", reminderTime: "6:01pm",timestamp: 2};
            var chunk8 = {deviceID: "Apple iPad", user: "bryan@cpp.edu", reminderTime: "6:01pm",timestamp: 2};
            var chunks = [chunk1,chunk2,chunk3,chunk4,chunk5,chunk6,chunk7,chunk8];
            chunks.forEach(function(entry){
                db.create(entry);
            })

            chunks.length.should.be.equal(8);
        })
    });
    describe('#test2', function(){
        it('should be a string', function(){
            foo.should.be.a.string;
        });
    });
});

describe('Http specific tests', function(){
    describe('#test1', function(){
        it('should test something http');
    });
});

describe('Socket.io specific tests', function(){
    describe('#test1', function(){
        it('should test something socket.io');
    });
});

describe('Connection list specific tests', function(){
    var connList = require('../connList.js')
    var conn = new connList()
    var user
    var device1, device2
    var connection1, connection2
    before(function(){
        user = 'bob'
        device1 = 'Galaxy'
        connection1 = '1234abcd'
        device2 = 'iPhone'
        connection2 = '5678efgh'
        connection2b = '9999zzzz'
    })
    describe('1 Get user from empty dict', function(){
        it('should return empty string', function(){
            var result = conn.get(user)
            result.should.be.equal('')
        });
    });
    describe('2 Set an initial connection', function(){
        it('should add array of one connection', function(){
            conn.set(user, device1, connection1)
            var ary = []
            ary.push({device:device1, connection:connection1})
            var result = conn.get(user)
            result.should.be.deep.equal(ary)
        });
    });
    describe('3 Set a second connection', function(){
        it('should add to array of connections', function(){
            conn.set(user, device2, connection2)
            var ary = []
            ary.push({device:device1, connection:connection1})
            ary.push({device:device2, connection:connection2})
            var result = conn.get(user)
            result.should.be.deep.equal(ary)
        });
    });
    describe('4 Set an existing device with new connection', function(){
        it('should change array of device connection', function(){
            conn.set(user, device2, connection2b)
            var ary = []
            ary.push({device:device1, connection:connection1})
            ary.push({device:device2, connection:connection2b})
            var result = conn.get(user)
            result.should.be.deep.equal(ary)
        });
    });
    describe('5 Get user from populated dict', function(){
        it('should return array of device-connection Objects', function(){
            var result = conn.get(user)
            var ary = []
            ary.push({device:device1, connection:connection1})
            ary.push({device:device2, connection:connection2b})
            result.should.be.deep.equal(ary)
        });
    });
});

describe.only('ChaiDictDB specific tests', function(){
    var mainFile
    var testFile
    var chaiDB
    var db
    var validdata1, validdata2, baddata1
    var util
    before(function(){
        mainFile = './public/maindb.json'
        testFile = './public/testdb.json'
        chaiDB = require('../chaiDictDB.js')
        util = require('../util.js')
    })
    beforeEach(function(){
        db = new chaiDB(testFile)
        validdata1 = {
            "deviceID":"abcd",
            "user":"bob",
            "data":[{"notification":"something"}],
            "timestamp":1234}
        validdata2 = {
            "deviceID":"efgh",
            "user":"jan",
            "data":[{"notification":"something"}],
            "timestamp":5678}
        baddata1 = {
            "deviceID":"abcd",
            //"user":"bob",
            "data":[{"notification":"something"}],
            "timestamp":1234}
    });
    describe('1 Get main file and get using file', function(){    
        it('should be the same', function(){         
            db.getMain().should.be.equal(testFile)
            db.setMain(mainFile)
            db.getMain().should.be.equal(mainFile)
            db.setMain(testFile)
            db.getMain().should.be.equal(testFile)
        });
    });
    describe('2 Create a valid data db entry', function(){    
        it('should create a new property and return true', function(){         
            db.create(validdata1).should.be.equal(true)
            //console.log('db contents: ' + db.toString())
            db.contains(validdata1).should.be.equal(true)
            db.contains(validdata2).should.be.equal(false)
        });
    });
    describe('3 Create a valid data db entry 2 times', function(){    
        it('should return false and error message', function(){      
            db.create(validdata1).should.be.equal(false)
        });
    });
    describe('4 Create from invalid data', function(){    
        it('should return false and error message', function(){      
            db.create(baddata1).should.be.equal(false)
        });
    });
    describe('5 Read data with valid id', function(){    
        it('should return value', function(){
            db.read(validdata1).should.be.deep.equal(validdata1)
        });
    });
    describe('6 Read data with null id', function(){    
        it('should return null and error message', function(){
            should.not.exist(db.read(null))
        });
    });
    describe('7 Read data with invalid id', function(){    
        it('should return null and error message', function(){
            should.not.exist(db.read('not_in_db'))
        });
    });
    describe('8 Update data with valid id', function(){    
        it('should return true', function(){
            validdata1.timestamp = 5555
            db.update(validdata1).should.equal(true)
        });
    });
    describe('9 Update data with invalid id', function(){    
        it('should return false and error message', function(){
            baddata1.timestamp = 5555
            db.update(baddata1).should.equal(false)
        });
    });
    describe('10 Delete data with valid id', function(){    
        it('should return true', function(){
            var id = util.getId(validdata2)
            db.create(validdata2)
            db.delete(validdata2).should.equal(true)
        });
    });
    describe('11 Delete data twice with valid id ', function(){    
        it('should return false and error message', function(){
            var id = util.getId(validdata2)
            db.create(validdata2)
            db.delete(validdata2).should.equal(true)
            db.delete(validdata2).should.equal(false)
        });
    });
    describe('12 Delete data with invalid id ', function(){    
        it('should return false and error message', function(){
            db.delete(baddata1).should.equal(false)
        });
    });
    // describe('13 Create valid data ', function(){    
    //     it('should save to file', function(){
    //         var fs = require('fs');
    //         var dat1 = {"user":"a","data":[{"notification":"something"}],"deviceID":"", "timestamp":1}
    //         var dat2 = {"user":"b","data":[{"notification":"something"}],"deviceID":"", "timestamp":1}
                           
    //         var content;
    //         fs.readFile(testFile, function (err, data) {
    //             if (err) { throw err;}
    //             console.log(data);
    //         });
    //     });
    // });
    describe.only('13 Load initial database', function(){
        it('should load from a file', function(){
            db.loadFromFile()
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
        util = require('../util.js')
        data1 = null
        data2 = {}
        data3 = {"user":"a", "data":"a","timestamp":1} 
        data4 = {"deviceID":"a", "data":"a","timestamp":1} 
        data5 = {"user":"a", "deviceID":"a","timestamp":1} 
        data6 = {"user":"a", "deviceID":"a","data":"a"} 
        data = {
            "deviceID":"iPad-4603488219",
            "user":"angie@cpp.edu",
            "data":[{"notification":"something"}],
            "timestamp":1494120903705}
    })
    beforeEach(function(){
    });
    describe('1 Validate client data from invalid inputs', function(){    
        it('should be false', function(){
            util.validateClientData(data1).should.be.equal(false)
            util.validateClientData(data2).should.be.equal(false)
            util.validateClientData(data3).should.be.equal(false)
            util.validateClientData(data4).should.be.equal(false)
            util.validateClientData(data5).should.be.equal(false)
            util.validateClientData(data6).should.be.equal(false)
        });
    });
    describe('2 Validate client data from valid inputs', function(){    
        it('should be true', function(){         
            util.validateClientData(data).should.be.equal(true)
        });
    });
    describe('3 Get ID from invalid data', function(){    
        it('should be null', function(){         
            should.not.exist(util.getId(data1))
            should.not.exist(util.getId(data2))
            should.not.exist(util.getId(data3))
            should.not.exist(util.getId(data4))
            should.not.exist(util.getId(data5))
            should.not.exist(util.getId(data6))
        });
    });
    describe('4 Get ID from valid data', function(){    
        it('should be user_dataType', function(){         
            util.getId(data).should.be.equal('angie@cpp.edu_notification')
        });
    });
    afterEach(function(){
    });
    after(function(){
    });
});