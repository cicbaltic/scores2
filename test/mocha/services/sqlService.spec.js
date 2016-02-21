var assert = require('assert');

describe('Tests for prepared statement sql', function() {
    describe('Requiring sqlService and prepping for tests...', function() {
        var sql = require('../../../server/services/sqlService.js');

        it('Should run a basic query', function() {
            // sql.queryDb("select * from score where hackathonid = ? and criteriaid = ?", ["1", "6"], function(result) {
            //     //console.log(JSON.stringify(result, null, "  "));
            //     assert.equal(result.length > 0, true);
            //     done();
            // });
        });

        it('Should run a basic transaction', function() {
            // var statements = [
            //     {
            //         statement: 'select * from users where lcase(name) like ?',
            //         parameters: ['tom%']
            //     },
            //     {
            //         statement: 'select * from hackathoncriteria where hackathonid = ?;',
            //         parameters: [1]
            //     }
            // ];
            // sql.transactDb(statements, function(result) {
            //     console.log(JSON.stringify(result, null, "  "));
            //     done();
            // });
        });
    });
});
