/* jshint node: true, es5: true */
'use strict';

function adminPanelService(req, res, next) {
    var dataBaseService = require('./sqlService');
    var userService = require('./userService');
    var requestParameters = req.body.requestParameters;
    var info = {};
    //console.log('inServ: ' + JSON.stringify(requestParameters));

    //if (requestParameters.hackathonID !)

    var getAllUserInfoMsg = {
        querry: '' +
            "SELECT NAME, SURNAME, EMAIL, DESCRIPTION, ID " +
            "FROM USERS " +
            "WHERE ID IN (SELECT USERID FROM ACCESS WHERE (HACKATHONID = ? or HACKATHONID is null) and ROLEID = ?)"
    };
    var getAllHackathonInfoMsg = {querry: 'SELECT "DESCRIPTION","ID","NAME" FROM HACKATHON' };

    var action = {
        loadUserHackathon: function() {
            if (requestParameters.hackathonListRequired) {
                dataBaseService.queryDb(getAllHackathonInfoMsg.querry, [], function(response) {
                    info.hackathon = response;
                    dataBaseService.queryDb(getAllUserInfoMsg.querry, [requestParameters.hackathonID, requestParameters.roleID], function(response) {
                        info.user = response;
                        info.statusCode = 200;
                        req.data = info;
                        next();
                    });
                });
            } else {
                dataBaseService.queryDb(getAllUserInfoMsg.querry, [requestParameters.hackathonID, requestParameters.roleID], function(response) {
                    info.user = response;
                    info.statusCode = 200;
                    req.data = info;
                    next();
                });
            }
        },
        updateUser: function() {
            userService.updateUser ({userID: requestParameters.user.id,
                    name: requestParameters.user.name,
                    surname: requestParameters.user.surname,
                    description: requestParameters.user.description}, function() {
                dataBaseService.queryDb(getAllUserInfoMsg.querry, [requestParameters.hackathonID, requestParameters.roleID], function(response) {
                    info.user = response;
                    info.statusCode = 200;
                    req.data = info;
                    next();
                });
            });
        },
        deleteUser: function() {
            userService.deleteRole ({userID: requestParameters.user.id,
                   hackathonID: requestParameters.hackathonID,
                   roleID: requestParameters.roleID}, function(response) {
                dataBaseService.queryDb(getAllUserInfoMsg.querry, [requestParameters.hackathonID, requestParameters.roleID], function(response) {
                    info.user = response;
                    info.statusCode = 200;
                    req.data = info;
                    next();
                });
            });
        },
        addUser: function() {
            userService.checkUser (requestParameters.user.email, function(response) {
                if (!response[0]) {
                    userService.createUser({name: requestParameters.user.name,
                        surname: requestParameters.user.surname,
                        email: requestParameters.user.email,
                        description: requestParameters.user.description}, function(response) {
                        userService.createRole({hackathonID: requestParameters.hackathonID,
                            roleID: requestParameters.roleID,
                            userID: response}, function() {
                            dataBaseService.queryDb(getAllUserInfoMsg.querry, [requestParameters.hackathonID, requestParameters.roleID], function(response) {
                                info.user = response;
                                info.statusCode = 201;
                                req.data = info;
                                next();
                            });
                        });
                    });
                } else {
                    var userID = response[0].ID;
                    userService.createRole ({hackathonID: requestParameters.hackathonID,
                            roleID: requestParameters.roleID,
                            userID: userID}, function() {
                        dataBaseService.queryDb(getAllUserInfoMsg.querry, [requestParameters.hackathonID, requestParameters.roleID], function(response) {
                            info.user = response;
                            info.statusCode = 200;
                            req.data = info;
                            next();
                        });
                    });
                }
            });
        },
        addHackathon: function() {
            var message = {querry: "INSERT INTO HACKATHON (NAME, DESCRIPTION) VALUES ('" +
                requestParameters.user.hackathonName + "','" +
                requestParameters.user.hackathonDescription + "') " };
            dataBaseService.queryDb(message.querry, [], function(response) {
                dataBaseService.queryDb(getAllHackathonInfoMsg.querry, [], function(response) {
                    var statement = '' +
                        'SELECT ' +
                            'ID ' +
                        'FROM ' +
                            'HACKATHON ' +
                        'WHERE ' +
                            'NAME = ? ;';
                    dataBaseService.queryDb(statement, [requestParameters.user.hackathonName], function(response) {
                        console.log(response[0].ID);
                        info.hackathon = response;
                        info.statusCode = 201;
                        req.data = info;
                        next();
                    });
                });
            });
        }
    };
    switch (requestParameters.actionToPerform){
        case 'loadUserHackathon': {
            action.loadUserHackathon(); break;
        }
        case 'updateUser': {
            action.updateUser(); break;
        }
        case 'deleteUser': {
            action.deleteUser(); break;
        }
        case 'addUser': {
            action.addUser(); break;
        }
        case 'addHackathon': {
            action.addHackathon(); break;
        }
    }
}
module.exports = adminPanelService;
