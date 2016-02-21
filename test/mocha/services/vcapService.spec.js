var assert = require('assert');

var environment = require('../../../server/services/vcapService.js');

describe("This should return the environment variable", function() {
    describe("This should fetch the VCAP_SERVICES variable", function() {
        it("should return Object-storage info array", function() {
            var oss = environment.getVCAP();
            assert.equal(oss.hasOwnProperty("Object-Storage"), true);
        });
    });
});
