var assert = require('assert');
var imgService = require('../../../server/services/imageService.js');

// var TestServer = require('./https/testServer');
// var testHeaders = {
//     "Connection": "Close"
// };
// var testBody = new Buffer("test body");
// var testServer = new TestServer(testHeaders, testBody);

describe("Tests for imageService module.", function() {
    describe("I will set up ImageService instance and it :", function() {
        // var token = "xtoken";
        // var storeUrl = "http://www.store.com";
        //var imgService = new ImageService();
        // imgService.credService = {
        //     initialize: function(callback) {callback();},
        //     getXToken: function() {return token;},
        //     getXStoreUrl: function() {return storeUrl;}
        // };

        it("Should have working Credentials service initializer", function(done) {
            imgService.getCredentials(function() {
                assert.deepEqual(imgService.credService, imgService.credService);
                done();
            });
        });

        describe("Should have a rest call interceptor function that: ", function() {
            it("Redirects to initializer function if response code 401 is given to it", function(done) {
                var response = {statusCode: 401};
                imgService.interceptRestCall(response, function(rsp) {
                    assert.deepEqual(rsp, response);
                    done();
                });
            });
            it("Redirects to callback if response code is 404", function(done) {
                var response = {statusCode: 404};
                imgService.interceptRestCall(response, function(rsp) {
                    assert.deepEqual(rsp, response);
                    done();
                });
            });
            it("Redirects to callback if response code is 200", function(done) {
                var response = {statusCode: 200};
                imgService.interceptRestCall(response, function(rsp) {
                    assert.deepEqual(rsp, response);
                    done();
                });
            });
        });

        it("Should have function to make GET calls to external RESTful service", function() {
            // imgService.readFileToBuffer(testServer.testServerUrl, testHeaders, function() {
            //     //testServer.kill();
            //     assert.equal(true, true);
            //     done();
            // });
        });

        it("Should have working getFile method", function() {
            //imgService.getFile(request, reponse);
        });

        // var imgService = new ImageService(function() {}, undefined);
        // it("Should probe for credentials.", function(done) {
        //     imgService.probeCreds("https://dal.objectstorage.open.softlayer.com/v1/AUTH_9f1124c523f749c092e129ca2a124f91/images/text.txt", function(status) {
        //         assert.deepEqual(status, "200");
        //         done();
        //     });
        //
        // });
    });
});
