var app = angular.module('myApp', []);

app.controller("serverController", function() {
    //get the db.json content as a object
    $.ajax({ url: "db.json", success: function(file_content) {

        //parse the json object to string
        var content = JSON.stringify(file_content);

        //if first and last characters are { or }, delete them
        if (content.charAt(0) === '{') {
            content = content.substr(1)
        }
        var strLength = content.length;
        if (content.charAt(strLength - 1) == "}") {
            content = content.slice(0,-1);
        }

        //split the string by '},' into an array
        var contentSplit = content.split(['},']);

        //append each element of the array to the html as a piece of data from the database
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