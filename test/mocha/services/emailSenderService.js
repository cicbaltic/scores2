/*
describe ('email sender evaluation', function () {

    var assert = require('assert');
    var loginEvaluation = new require ('../../../server/services/emailSend.js');
    var request = require('supertest');
    var response;
    var responseFromSrv;
    var message = {'info': "Some Information to send via email"};
    var port = require('../../../server/app').port;

    it ('should return "success"',
        function (done) {
            this.timeout(5000);
            request("http://localhost:" + port)
               .post('/sendMail')
               .send(message)
               .end(function(err,res) {
        			if (err) {
        				throw err;
        			}
                    done();
        	           res.body.should.have.property('isStatus');
                       res.body.isStatus.should.have.property('success');
        		});
               // end handles the response
        });
});
*/
