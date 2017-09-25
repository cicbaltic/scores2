/* jshint node:true, es5:true*/
'use strict';

var userService = require('./userService');

function UserController() {
    var self = this;

    self.updateUserInfo = function updateUserInfo(request, response) {
        var user = {
            name: request.body.name,
            surname: request.body.surname,
            description: request.body.description,
            userID: request.body.userID
        };

        userService.updateUser(user, function(res) {
            response.writeHead(201, {
                "Content-Type": "application/json;charset=utf-8",
                "Content-Length": 0
            });
            response.end();
        });
    };

    self.registerNewUser = function registerNewUser(request, response) {
        var user = {
            name: request.body.name,
            surname: request.body.surname,
            email: request.body.email,
            description: request.body.description
        };

        userService.createUser(user, function(res) {
            var payload = JSON.stringify({
                userID: String(res)
            });
            response.writeHead(201, {
                "Content-Type": "application/json;charset=utf-8",
                "Content-Length": payload.length
            });
            response.end(payload);
        });
    };

    self.informAboutNewRole = function(request, response){
        var user = {
            name: request.body.name,
            surname: request.body.surname,
            email: request.body.email,
            hackathonId: request.body.hackathonId,
            role: request.body.role
        };
        userService.informAboutNewRole(user, function(res){
            
            response.writeHead(201, {
                "Content-Type": "application/json;charset=utf-8",
                // "Content-Length": payload.length
            });
            response.end(JSON.stringify({status: "OK"}));
        });
    };

}

module.exports = UserController;
