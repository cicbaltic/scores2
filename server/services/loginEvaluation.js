/* jshint node: true, es5: true */
'use strict';

function loginEvaluation(req, res, next) {
    var crypto = require('crypto');
    var username = req.body.username.toLowerCase();
    var password = req.body.password;
    var responseBack = {};
    var dataBaseService = require('./sqlService');
    var message = {querry: "SELECT ID, PASSWORD FROM USERS WHERE EMAIL LIKE '" + username + "';"};

    dataBaseService.queryDb(message.querry, [], function(response) {
        if (typeof response[0] === 'object') {
            var DBPasword = response[0].PASSWORD;
            var salt = DBPasword.slice(64);
            var hash = crypto
                .createHash("sha256")
                .update(password + salt)
                .digest('hex');
            var hashSalt = hash + salt;
            //require('./userService').checkPass({userId: response[0].ID, password: password}, function(b) {console.log("Is the password goode? " + b);});
            if (response[0].PASSWORD == hashSalt) {
                var message = {querry: "SELECT HACKATHONID, ROLEID FROM ACCESS WHERE USERID LIKE '" + response[0].ID + "';"};
                dataBaseService.queryDb(message.querry, [], function(responseRoles) {
                    responseBack.success = responseRoles;
                    responseBack.statusCode = 200;
                    req.data = responseBack;
                    next();
                });
            } else {
                responseBack.success = 'Username or password is incorrect';
                responseBack.statusCode = 401;
                req.data = responseBack;
                next();
            }
        } else {
            responseBack.success = 'Username or password is incorrect';
            responseBack.statusCode = 401;
            req.data = responseBack;
            next();
        }
    });
}

module.exports = loginEvaluation;
