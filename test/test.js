// Use Chai-should style assertions
var chai = require('chai');
var should = chai.should();
var chaiDB = require('../chaiDB.js');
var db = new chaiDB('../public/testdb.json');
var foo;
var chunks;

// Describe structure of test suite
before(function(){
    foo = 'peanut';
});
beforeEach(function(){
    
});
describe('Database tests', function(){
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
    describe('#test3', function(){
        it('should be a string');
    });
});

describe('Http specific tests', function(){
    describe('#test1', function(){
        it('should be a string');
    });
    describe('#test2', function(){
        it('should be a string');
    });
    describe('#test3', function(){
        it('should be a string');
    });
});

describe('Socket.io specific tests', function(){
    describe('#test1', function(){
        it('should be a string');
    });
    describe('#test2', function(){
        it('should be a string');
    });
    describe('#test3', function(){
        it('should be a string');
    });
    afterEach(function(){

    });

    after(function(){

    });
});