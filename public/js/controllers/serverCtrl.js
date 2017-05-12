var app = angular.module('myApp', []);

app.controller("serverController", function($scope) {
    $.ajax({ url: "db.json", success: function(file_content) {
        var content = JSON.stringify(file_content);
        console.log(content);
        var node = document.getElementById('jsonDisplay');
        var newNode = document.createElement('code');
        newNode.appendChild(document.createTextNode(content));
        node.appendChild(newNode);
    }
    });
});