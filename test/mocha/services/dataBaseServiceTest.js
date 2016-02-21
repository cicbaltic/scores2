/*jshint node: true, es5:true, mocha:true*/
'use strict';

describe ('dataBase Service', function() {

    var assert = require('assert');
    var dataBaseService = require('../../../server/services/sqlService.js');
    var response;
    var message = {querry: "SELECT ID, PASSWORD FROM USERS " +
                        "WHERE EMAIL LIKE 'aiste@mail.com';"};

    beforeEach(function(done) {
        this.timeout(5000);
        dataBaseService.queryDb(message.querry, [], function(res) {
            response = res;
            done();
        });
    });
    it('server should return ID and PASSWORD when loged in with ' +
            '"aiste@mail.com", "aiste"',
        function() {
            assert(typeof response[0].ID === 'string');
            assert(typeof response[0].PASSWORD === 'string');
        });
});
