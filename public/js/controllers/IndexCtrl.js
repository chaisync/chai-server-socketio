var app = angular.module('IndexCtrl', []);
var data1;
var data2;

app.controller("indexController", function($scope){
    var socket = io.connect();
    $scope.user = {firstname: "", lastname: ""};

    $scope.submit = function(){
        $scope.user.firstname = $scope.firstname;
        $scope.user.lastname = $scope.lastname;

        data1 = $scope.firstname;
        data2 = $scope.lastname;

        var node = document.getElementById('outputLog');
        var newNode = document.createElement('p');
        newNode.appendChild(document.createTextNode("data1 is " + data1 + ", data2 is " + data2));
        node.appendChild(newNode);

        socket.emit('send message', $scope.user);
        //socket.emit('send message', {firstname: $scope.firstname,lastname: $scope.lastname});
        document.getElementById("msgdiv").style.backgroundColor = "lightblue";
        document.getElementById("firstname").value = "";
        document.getElementById("lastname").value = "";

    };

    $scope.toggleOF = function() {

        var el = document.getElementById('ofbt');
        if (el.firstChild.data == "Offline")
        {
            el.firstChild.data = "Online";
            el.className = "btn btn-success";
        }
        else
        {
            el.firstChild.data = "Offline";
            el.className = "btn btn-danger";
        }
    };

    socket.on('new message', function(data){
        document.getElementById("msgdiv").style.backgroundColor = "pink";
        console.log("Received data: " + JSON.stringify(data));
        console.log(data.firstname);

        //var obj = JSON.parse(data);
        console.log(data.firstname);

        var node = document.getElementById('outputLog');
        var newNode = document.createElement('p');
        newNode.appendChild(document.createTextNode("data1 is " + data.firstname + ", data2 is " + data.lastname));
        node.appendChild(newNode);

        $scope.$apply(function(){
            $scope.user.firstname = data.firstname;
            console.log("firstname is " + data.firstname);
            $scope.user.lastname = data.lastname;
        })
    })
});
