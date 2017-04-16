// Use Chai-should style assertions
var chai = require('chai');
var should = chai.should();


// Describe structure of test suite
before(function(){
    var foo = 'peanut';
});
beforeEach(function(){

});
describe('General tests first', function(){
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