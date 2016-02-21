var db = require('./sqlService');
var SqlHelper = require('./helpers/sql.js');
var sqlHelper = new SqlHelper();

function AutocompleteService() {
    var self = this;

    self.searchUsers = function searchUsers(request, response) {
        var query = '' +
            'select ' +
                'u.NAME ,' +
                'u.SURNAME, ' +
                'u.DESCRIPTION, ' +
                'u.EMAIL, ' +
                'u.ID ' +
            'from ' +
                'users u ' +
            // 'where ' +
            //     'u.ID not in (' +
            //         'select USERID ' +
            //         'from access ' +
            //         'where roleid = 3 and hackathonid = ? ' +
                ';';

        var sparams = [];

        db.queryDb(query, sparams, function(result) {
            var resultTxt = JSON.stringify(result, null, "  ");
            response.writeHead(200, {
                "Content-Type": "application/json;charset=utf-8",
                // "Content-Length": resultTxt.length
            });
            response.end(resultTxt);
        });

    };

}

module.exports = AutocompleteService;
