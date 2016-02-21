/*
describe ('score getter Test', function () {
    //login evaluation

    var assert = require('assert');
    //var loginEvaluation = new require ('../../../server/services/.js');
    var request = require('supertest');
    var response;
    var responseFromSrv;
    var port = require('../../../server/app').port;

    it ('server should return scores ', function (done) {
            this.timeout(5000);
            request('http://localhost:' + port)
               .post('/scoreinfogetter')
               .send(args)
               .end(function(err,res) {
        			if (err) {
        				throw err;
        			}
                    done();
        	                //res.data.success[0].HACKATHONID.should.equal(1);
        	                //res.data.success[0].ROLEID.should.equal(2);

                            res.data.should.have.property('HACKATHONID:');

        		});
               // end handles the response

        });
});
*/
