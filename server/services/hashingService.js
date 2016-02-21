/*jslint node: true, es5:true*/
'use strict';
var crypto = require('crypto');

function HashingService() {
    var self = this;

    self.hashEmail = function hashEmail(email) {
        return crypto.createHash("sha1").update(email).digest('hex');
    };

    self.hashPassword = function hashPassword(password) {
        var salt;
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 10; i++) {
            salt += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return crypto.createHash("sha256").update(password + salt).digest('hex') + salt;
    };
}

module.exports = exports = new HashingService();
