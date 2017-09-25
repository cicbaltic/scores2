/*jshint node: true, es5: true*/
'use strict';
var jwt = require('jsonwebtoken');
var userService = require('./userService');
var server = require('../app.js');
var crypto = require('crypto');

function TokenService() {
    var self = this;
    // payload = { authorization: "Basic dsfdfs45f45fs" };
    self.getToken = function getToken(payload, callback) {
        self.checkCredentials(self.un64Auth(payload), function(credentials) {
            if (credentials.userAuth) {
                callback({
                    userAuth: true,
                    token: self.generateToken(credentials)
                });
                // console.log(self.generateToken(credentials));
            } else {
                callback(credentials);
            }
        });
    };

    // payload = { x-token: "blabla.blabla.blabla"}
    self.checkToken = function checkToken(payload, callback) {
        if (payload['x-token']) {
            jwt.verify(payload['x-token'], server.tokenSecret, function(err, decoded) {
                if (err) {
                    callback(err);
                } else {
                    callback(decoded);
                }
            });
        } else {
            callback({ info: 'no token' });
        }

    };

    self.generateToken = function generateToken(payload) {
        // var secret = '812geuyfdgsjfyefuwefewjygwfyewifgewdejfewuewyfdgdskufdsygfdsfyudafewdedgfwdyugewyudgiyedgqudsadjdgdajftef6eitdsafdsgfyudsftdsyfdfyftdyftdfyduftsdgciudshcdsyucgscyucgsiduygcdisfgyusfgieysyfdsgfdyfgdfydsugdsucdsyfgdsfiudsygfyudsiftdsfyutdiutsiuftdsiytcgcdhd';
        return jwt.sign(payload, server.tokenSecret, { // secret
            expiresIn: 60 * 60 * 24 * 3 // expires in seconds
        });
    };
    //payload = {userId: "xyz", password: "original"}
    self.checkCredentials = function checkCredentials(payload, callback) {
        var returnObject = { userAuth: false };
        if (payload.userId === undefined) {
            returnObject.reason = 'No user id specified';
            callback(returnObject);
        } else if (payload.password === undefined) {
            returnObject.reason = 'No password specified';
            callback(returnObject);
        } else {
            userService.getPassHash(payload, function(result) {
                if (result.length > 0) {
                    var passHash = result[0].password;
                    if (self.checkPassword(passHash, payload.password)) {
                        returnObject.userAuth = true;
                        returnObject.userId = self.convertEmailToUsername(payload.userId);
                        returnObject.email = payload.userId;
                        callback(returnObject);
                    } else {
                        returnObject.reason = 'Incorrect password supplied';
                        callback(returnObject);
                    }
                } else {
                    returnObject.reason = 'Incorrect username supplied';
                    callback(returnObject);
                }
            });
        }
    };

    self.un64Auth = function un64Auth(payload, callback) {
        var auth = payload.authorization;
        auth = auth.substring(6, auth.length);
        var userPass = (new Buffer(auth, "base64")).toString("utf-8").split(":");
        if (userPass.length < 2) {
            return { };
        } else {
            return { userId: userPass[0], password: userPass[1] };
        }
    };

    self.checkPassword = function checkPassword(hashPass, realPass) {
        var salt = hashPass.slice(64);
        var hashSalt = crypto
            .createHash("sha256")
            .update(realPass + salt)
            .digest('hex') + salt;
        return (hashSalt === hashPass);
    };

    self.convertEmailToUsername = function convertEmailToUsername(email) {
        return crypto.createHash("sha1").update(email).digest('hex');
    };
}

module.exports = exports = new TokenService();
