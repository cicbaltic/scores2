var assert = require('assert');

var tocken = "testoken";
var reso = {
    token: {
        catalog: [{
           endpoints: [{
              'region_id': "dallas",
               url: "https://dal.objectstorage.open.softlayer.com/v1/AUTH_",
               interface: "public"
           }],
           type: "object-store"
       }]
    }
};
var headers = {"X-Subject-Token": tocken, "Content-Type": "application/json", "Connection": "Close"};

var TestServer = require('./https/testServer');
var testServer = new TestServer(headers, JSON.stringify(reso));

var credService = require('../../../server/services/ossCredService.js');

describe("Tests for Object storage credentials service.", function() {
    describe("I will create a credentials object and it: ", function(done) {
        // credService.initialize(function() {
        //     console.log(credService.getXToken());
        //     done();
        //     // testServer.kill(function() {
        //     //     console.log("SERVER'S DEAD, baby");
        //     //     done2();
        //     // });
        // }, "https://localhost:8000/");

        it("Should have correct X-Subject-Token.", function() {
            //console.log(credService.getXToken());
            credService.initialize(function() {
                assert.deepEqual(credService.getXToken(), tocken);
                done();
            },"https://localhost:8000/");
        });

        it("Should have correct X-Storage-Url.", function() {
            //console.log(credService.getXStoreUrl());
            credService.initialize(function() {
                assert.equal(credService.getXStoreUrl().indexOf("v1/AUTH"), 45);
                done();
            },"https://localhost:8000/");
        });
    });
});
