/*jshint node: true, es5: true*/
'use strict';

var userService = require('./userService');
var tokenService = require('./tokenService');


function AuthorizationService() {
    var self = this;

    self.intercept = function intercept(req, res, next) {
        if (req.headers['x-token'] !== undefined) {
            tokenService.checkToken(req.headers, function(result) {
                if (result.userAuth === true) {

                }
            });
        } else {
            next();
        }
    };

    //payload = {userId: 'xyz'}
    /* roleObject = {
        userid: {
            hackathonId: {
                roleid: true,
                roleid: true
            }
        }
    }*/
    self.getUserRoles = function getUserRoles(payload, callback) {
        userService.getRolesForUser(payload, function(result) {
            var roleObject = {};
            for (var i = 0; i < result.length; i++) {
                var user = result[i].userId;
                var hack = result[i].hackathonId;
                var role = result[i].role;

                if (roleObject[user]) {
                    if (roleObject[user][hack]) {
                        roleObject[user][hack][role] = true;
                    } else {
                        roleObject[user][hack] = {};
                        roleObject[user][hack][role] = true;
                    }
                } else {
                    roleObject[user] = {};
                    roleObject[user][hack] = {};
                    roleObject[user][hack][role] = true;
                }
            }
            callback(roleObject);
        });
    };

    self.getHackathonId = function getHackathonId(req) {
        if (req.params) {
            if (req.params.hackathonId) {
                return req.params.hackathonId;
            }
        }

        if (req.body) {
            if (req.body[0]) {
                return req.body[0].hackathonID;
            } else {
                return req.body.HACKATHONID || req.body.hackathonID || req.body.hackathonId;
            }
        }

        console.log('no hack');
        return undefined;
    };

    self.hasAccess = function hasAccess(role) {
        var failResponse = function(res, reason) {
            res.writeHead(401, {});
            res.end(JSON.stringify(
                {message: 'request denied', reason: reason},
                null, ' ')
            );
        };

        var usrServiceHandler = function(result, payload, reason, req, res, next) {
            if (result.length > 0) {
                req.authentication = { payload: payload, autheticated: true };
                next();
            } else {
                failResponse(res, reason);
            }
        };

        return function(req, res, next) {
            var payload = {
                hackathonID: self.getHackathonId(req),
                roleID: role
            };
            if (req.headers['x-token'] !== undefined) {
                tokenService.checkToken(req.headers, function(result) {
                    payload.userID = result.userId;
                    if (role === 1 && result.userAuth === true) {
                        userService.isAdmin(payload, function(resultIn) {
                            usrServiceHandler(resultIn, payload, 'User not admin', req, res, next);
                        });
                    } else if (role !== 1 && result.userAuth === true && payload.hackathonID !== undefined) {
                        userService.checkRole(payload, function(resultIn) {
                            usrServiceHandler(resultIn, payload, 'User unauthorized', req, res, next);
                        });
                    } else {
                        failResponse(res, 'Bad token or unprovided hackathon id');
                    }
                });
            } else {
                failResponse(res, 'No token provided');
            }
        };
    };

}

module.exports = exports = new AuthorizationService();
