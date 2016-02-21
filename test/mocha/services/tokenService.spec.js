/*jshint node: true, es5: true, mocha: true*/
'use strict';

var assert = require('assert');
var tokenService = require('../../../server/services/tokenService');

describe('Tests for token service:', function() {
    describe('Checking password authenticity; it should: ', function(done) {
        it('Return true on this pass-hash pair.', function() {
            var result = tokenService.checkPassword(
                '589a35a3bb59a64cb6dd9ccf4b136343d50a774b946df1fbc8d31927ac35d9acm342hi37Xu',
                'tom'
            );
            assert.deepEqual(result, true);
        });

        it('Return false on another pass-hash pair.', function() {
            var result = tokenService.checkPassword(
                '589a35a3bb59a64cb6dd9ccf4b137343d50a774b946df1fbc8d31927ac35d9acm342hi37Xu',
                'tom'
            );
            assert.deepEqual(result, false);
        });
    });

    describe('Checking checkCredentials function; it should: ', function(done) {
        var testUser = { userId: 'tom@mail.com', password: 'tom' };
        var correctCredentials = { userAuth: true, userId: 'c3a195263119d03b9c305eb373e4efa2ce552601', email: 'tom@mail.com' };
        it('Return correct credentials.', function() {
            tokenService.checkCredentials(testUser, function(result) {
                assert.deepEqual(result, correctCredentials);
                done();
            });
        });

        it('Return false on credentials (no user id).', function() {
            var testUser = { password: 'tom' };
            var correctCredentials = { userAuth: false, reason: 'No user id specified'};
            tokenService.checkCredentials(testUser, function(result) {
                assert.deepEqual(result, correctCredentials);
                //done();
            });
        });

        it('Return false on credentials (no password).', function() {
            var testUser = { userId: 'tom@mail.com' };
            var correctCredentials = { userAuth: false, reason: 'No password specified'};
            tokenService.checkCredentials(testUser, function(result) {
                assert.deepEqual(result, correctCredentials);
                //done();
            });
        });

        it('Return false on credentials (incorrect username).', function() {
            var testUser = { userId: 'tom@mail', password: 'tom' };
            var correctCredentials = { userAuth: false, reason: 'Incorrect username supplied'};
            tokenService.checkCredentials(testUser, function(result) {
                assert.deepEqual(result, correctCredentials);
                done();
            });
        });

        it('Return false on credentials (incorrect password).', function() {
            var testUser = { userId: 'tom@mail.com', password: 'tomtom' };
            var correctCredentials = { userAuth: false, reason: 'Incorrect username supplied'};
            tokenService.checkCredentials(testUser, function(result) {
                assert.deepEqual(result, correctCredentials);
                done();
            });
        });
    });

    describe('Check get token function. It should: ', function(done) {
        it('Return correct token for creds', function() {
            tokenService.getToken({
                authorization: 'Basic dG9tQG1haWwuY29tOnRvbQ=='
            }, function(result) {
                console.log(result);
                done();
            });
        });
    });
});
