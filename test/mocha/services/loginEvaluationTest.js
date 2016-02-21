describe ('login evaluation', function () {
    //login evaluation

    var assert = require('assert');
    var loginEvaluation = new require ('../../../server/services/loginEvaluation.js');
    var request = require('supertest');
    var response;
    var responseFromSrv;
    var port = require('../../../server/app').port;

    var message = {"querry": "SELECT ID, PASSWORD FROM USERS "+
                        "WHERE EMAIL LIKE 'aiste@mail.com';"};
    it ('server should return ID and PASSWORD when loged in with '+
            '"aiste@mail.com", "aiste" for password comparison ' + port,
        function (done) {
            this.timeout(5000);
            args = { 'username': 'aiste@mail.com', 'password': 'aiste'};
            request('http://localhost:' + port)
               .post('/authenticate')
               .send(args)
               .end(function(err,res) {
        			if (err) {
        				throw err;
        			}
                    done();
        	                res.data.success[0].HACKATHONID.should.equal(1);
        	                res.data.success[0].ROLEID.should.equal(2);

        		});
               // end handles the response

        });
});
