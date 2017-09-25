/*jshint node: true, es5:true*/
'use strict';

var randomPasswordGenService = require('./randomPasswordGenService');
var dataBaseService = require('./sqlService');
var crypto = require('crypto');
var emailSender = require('./emailSender');

function UserService() {
    var self = this;

    self.outbox = function outbox(id, password) {
        var statement = '' +
            'SELECT ' +
                'NAME, SURNAME, EMAIL ' +
            'FROM ' +
                'USERS ' +
            'WHERE ' +
                'ID = ? ;';
        dataBaseService.queryDb(statement, [id], function(response) {
            console.log(response);
            var someInformation = {emailTo: response[0].EMAIL,
                emailJson: {
                    name: response[0].NAME,
                    surname: response[0].SURNAME,
                    pass: password,
                    role: ''
                },
                emailSubject: 'IBM SCORES Credentials'};
            emailSender.emailSendingService(someInformation);
        });
        console.log('emailSent');

    };

    self.informAboutNewRole = function(userData, callback){
        //email, name, surname, hackatonID, role
        var statement = '' +
        'SELECT ' +
            'NAME ' +
        'FROM ' +
            'HACKATHON ' +
        'WHERE ' +
            'ID = ? ;';
        dataBaseService.queryDb(statement, [userData.hackathonId], function(response) {
            var someInformation = {
                emailTo: userData.email,
                emailJson: {
                    name: userData.name,
                    surname: userData.surname,
                    eventName: response[0].NAME,
                    role: userData.role
                },
                emailSubject: 'IBM SCORES new role'
            };
            emailSender.informAboutNewRole(someInformation);
            callback("OK");
        });
    };

    self.checkUser = function checkUser(email, callback) {
        var message = 'SELECT ID FROM USERS WHERE EMAIL = ? ;';
        dataBaseService.queryDb(message, [email], function(response) {
            callback (response);
            return;
        });
    };

    self.createUser = function createUser(user, callback) {
        randomPasswordGenService.randomPaswordGen(function(response) {
            try {
                var salt = '';
                var password = response;
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i = 0; i < 10; i++) {
                    salt += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                var passwordHash = crypto
                    .createHash("sha256")
                    .update(password + salt)
                    .digest('hex');
                passwordHash += salt;
                var usernameHash = crypto
                    .createHash("sha1")
                    .update(user.email)
                    .digest('hex');
                var statement = '' +
                    'INSERT INTO ' +
                        'USERS (ID, NAME, SURNAME, EMAIL, PASSWORD, DESCRIPTION) ' +
                    'VALUES ' +
                        '(?, ?, ?, ?, ?, ?) ;';
                var params = [
                    usernameHash,
                    user.name,
                    user.surname,
                    user.email,
                    passwordHash,
                    user.description === undefined ? '' : user.description
                ];
                if (self.checkParams(params)) {
                    callback(undefined);
                    return;
                }
                dataBaseService.queryDb(statement, params, function() {
                    console.log('TODO: remove comment to send email');
                    self.outbox(usernameHash, password); // TODO: remove comment to send email
                    callback(usernameHash);
                    return;
                });
            } catch (err) {
                callback(undefined);
                console.log(err);
            }
        });

    };

    self.updateUser = function updateUser(user, callback) {
        var statement = '' +
            'UPDATE ' +
                'USERS ' +
            'SET ' +
                'NAME = ?, ' +
                'SURNAME = ?, ' +
                'DESCRIPTION = ? ' +
            'WHERE ' +
                'ID = ? ;';
        var params = [user.name, user.surname, user.description, user.userID];
        dataBaseService.queryDb(statement, params, function(response) {
            callback(response);
            return;
        });
    };

    self.createRole = function createRole(role, callback) {
        var statement = '' +
            'INSERT INTO ' +
                'ACCESS (HACKATHONID, ROLEID, USERID) ' +
            'VALUES ' +
                '(?, ?, ?) ;';
        var params = [role.hackathonID, role.roleID, role.userID];
        dataBaseService.queryDb(statement, params, function(response) {
            callback(response);
            return;
        });
    };

    self.deleteRole = function deleteRole(role, callback) {
        var statement = '' +
            'DELETE FROM ' +
                'ACCESS ' +
            'WHERE ' +
                'USERID = ? ' +
                'AND HACKATHONID = ? ' +
                'AND ROLEID = ? ;';
        var params = [role.userID, role.hackathonID, role.roleID];
        dataBaseService.queryDb(statement, params, function(response) {
            callback(response);
            return;
        });
    };

    // role = { userID: 'xyx', hackathonID: 123, roleID: 1 }
    self.checkRole = function checkRole(role, callback) {
        var statement = '' +
            'SELECT ' +
                'ID ' +
            'FROM ' +
                'ACCESS ' +
            'WHERE ' +
                'USERID = ? ' +
                'AND HACKATHONID = ? ' +
                'AND ROLEID = ? ;';
        var params = [role.userID, role.hackathonID, role.roleID];
        dataBaseService.queryDb(statement, params, function(response) {
            callback(response);
            return;
        });
    };
    // role = { userID: 'xyx' }
    self.isAdmin = function isAdmin(role, callback) {
        var statement = '' +
            'SELECT ' +
                'ID ' +
            'FROM ' +
                'ACCESS ' +
            'WHERE ' +
                'USERID = ? ' +
                'AND ROLEID = 1 ;';
        var params = [role.userID];
        dataBaseService.queryDb(statement, params, function(response) {
            callback(response);
            return;
        });
    };

    // role = {userId: "xyz", hackathonId = 123};
    // returns a set set of roles for a given user in a given hackathons
    self.getRolesForHackathon = function getRolesForHackathon(role, callback) {
        var statement = '' +
            'select ' +
                'userid as "userId", ' +
                'roleid as "roleId", ' +
                'hackathonid as "hackathonId" ' +
            'from ' +
                'access ' +
            'where ' +
                'userid = ? ' +
                'and hackathonid = ?;';
        dataBaseService.queryDb(statement, [role.userId, role.hackathonId], function(response) {
            callback(response);
            return;
        });
    };
    // payload = { userId: "email@emil.com" }
    self.getPassHash = function getPassHash(payload, callback) {
        var statement = '' +
            'select ' +
                'password as "password" ' +
                //'id as "userId" ' +
            'from ' +
                'users ' +
            'where ' +
                'email = ?;';
        dataBaseService.queryDb(statement, [payload.userId], function(response) {
            callback(response);
            return;
        });
    };
    // payload = { userId: "email@emil.com" }
    self.getUserId = function getUserId(payload, callback) {
        var statement = '' +
            'select ' +
                'id as "userId" ' +
            'from ' +
                'users ' +
            'where ' +
                'email = ?;';
        dataBaseService.queryDb(statement, [payload.userId], function(response) {
            callback(response);
            return;
        });
    };

    // payload = { userId: "xyz", hackathonId: 123 }
    self.getRolesForUser = function getRolesForUser(payload, callback) {
        var statement = '' +
            'select ' +
                'access.hackathonid as "hackathonId", ' +
                'access.userid as "userId", ' +
                'roles.name as "role" ' +
            'from ' +
                'access ' +
                'left join roles on ' +
                    'roles.id = access.roleid ' +
            'where ' +
                'access.userid = ?;';
        dataBaseService.queryDb(statement, [payload.userId],
        function(result) {
            callback(result);
            return;
        });
    };

    self.getAllRoles = function getAllRoles(callback) {
        var statement = '' +
            'select ' +
                'hackathonid as "hackathonId", ' +
                'userid as "userId", ' +
                'roleid as "roleId" ' +
            'from ' +
                'access;';
        dataBaseService.queryDb(statement, [], function(result) {
            callback(result);
            return;
        });
        return;
    };

    self.resetPassword = function resetPassword(id, callback) {
        randomPasswordGenService.randomPaswordGen(function(response) {
            var salt = '';
            var password = response;
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 10; i++) {
                salt += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            var passwordHash = crypto
                .createHash("sha256")
                .update(password + salt)
                .digest('hex');
            passwordHash += salt;
            var statement = '' +
                'UPDATE ' +
                    'USERS ' +
                'SET ' +
                    'PASSWORD = ? ' +
                'WHERE ' +
                    'ID = ?;';
            var params = [
                passwordHash,
                id
            ];
            dataBaseService.queryDb(statement, params, function() {
                self.outbox(id, password);
                callback();
                return;
            });
        });
    };

    self.checkParams = function checkParams(params) {
        var isEmpty = false;
        for (var i = 0; i < params.length - 1; i++) {
            if (params[i] === undefined) {
                isEmpty = true;
            }
        }
        return isEmpty;
    };
}

module.exports = exports = new UserService();
