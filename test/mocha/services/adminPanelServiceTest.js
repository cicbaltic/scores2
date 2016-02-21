// describe ('adminPanelService', function () {
//     //login evaluation
//
//     var assert = require('assert');
//     var loginEvaluation = new require ('../../../server/services/adminPanelService.js');
//     var request = require('supertest');
//     var response;
//     var responseFromSrv;
//     var port = require('../../../server/app').port;
//     var actionToPerform;
//     var hackathonID;
//     var roleID;
//     var requestParameters = {};
//
//     it ("should return user, hackathon list when actionToPerform = 'loadUserHackathon'",
//         function (done) {
//             this.timeout(5000);
//             requestParameters.hackathonListRequired = true;
//             args = {
//             'actionToPerform': 'loadUserHackathon',
//             'hackathonID': '1',
//             'roleID': '2',
//             'requestParameters': requestParameters};
//             request('http://localhost:' + port)
//                .post('/organisers')
//                .send(args)
//                .end(function(err,res) {
//         			if (err) {
//         				throw err;
//         			}
//                     done();
//         	            res.data.user[0].NAME.should.be.type('string');
//         		});
//         });
// });
