var app = angular.module('myApp', []);

app.controller("serverController", function() {
    $.ajax({ url: "db.json", success: function(file_content) {
        var content = JSON.stringify(file_content);
        console.log(content);
        var contentSplit = content.split(['},']);
        console.log(contentSplit);
        var node = document.getElementById('jsonDisplay');
        for (var i = 0; i < contentSplit.length; i++) {
            var newNode = document.createElement('code');
            var brNode = document.createElement('br');
            var hNode = document.createElement('h4');
            var number = i+1;
            hNode.appendChild(document.createTextNode('Data #' + number));
            if (i != contentSplit.length-1) {
                newNode.appendChild(document.createTextNode(contentSplit[i] + '}'))
            } else {
                newNode.appendChild(document.createTextNode(contentSplit[i]))
            }
            console.log(i + ' + ' + contentSplit[i]);
            node.appendChild(hNode);
            node.appendChild(newNode);
            node.appendChild(brNode);
        }
    }
    });
});