var express = require('express')
var router = express()

router.get('/', function(req,res){    
    var path = __dirname + '/public/index.html';
});

router.get('/ping', function(req,res){    
    res.status(200).send('ok');
});

module.exports = router