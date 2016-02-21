var db = require('./sqlService');
var SqlHelper = require('./helpers/sql.js');
var sqlHelper = new SqlHelper();

function CriteriaService() {
    var self = this;

    self.newCriteriaCreate = function newCriteriaCreate(payload, callback) {
        var statements = [
            {
                statement: 'insert into criteria (name, description) values (?, ?);',
                parameters: [payload.name, payload.description]
            },
            {
                statement: 'select id from criteria where id = identity_val_local();',
                parameters: []
            }
        ];
        db.transactDb(statements, function(response) {
            self.assignCriteria({
                CRITERIAID: response[1][0].ID,
                HACKATHONID: payload.hackathonId,
                ASSIGN: true
            }, callback);
        });
    };

    // payload = {"ASSIGN": bool, "CRITERIAID": 123, "HACKATHONID": 123}
    self.assignCriteria = function assignCriteria(payload, callback) {
        var assign = '' +
            'insert into ' +
                'hackathoncriteria (criteriaid, hackathonid) ' +
            'values (?,?);';
        var unAssign = '' +
            'delete ' +
            'from ' +
                'hackathoncriteria ' +
            'where ' +
                'criteriaid = ? ' +
                'AND hackathonid = ?;';
        if (payload.ASSIGN === true) {
            db.queryDb(assign, [payload.CRITERIAID, payload.HACKATHONID], function(response) {
                callback(response);
            });
        } else if (payload.ASSIGN === false) {
            db.queryDb(unAssign, [payload.CRITERIAID, payload.HACKATHONID], function(response) {
                callback(response);
            });
        } else {
            // shouldn't happen
        }
    };

    // // payload = { NAME: 'xyz', DESCRIPTION: 'xyz', HACKATHONID: 123 }
    // self.createNewCriteria = function createNewCriteria(request, response) {
    //     var payload = request.body;
    //     var insertMsg = '' +
    //             'call NEW_CRITERIA(?, ?, ?);';
    //     var params = [payload.NAME, payload.DESCRIPTION, payload.HACKATHONID];
    //     db.queryDb(insertMsg, params, function(result) {
    //         response.writeHead(202, {
    //             "Content-Type": "application/json;charset=utf-8",
    //             "Content-Length": 0
    //         });
    //         response.end();
    //     });
    // };

    self.assignHackathonCriteria = function assignHackathonCriteria(request, response) {
        var hackathonId = request.params.hackathonId;
        var criteriaId = request.body.CRITERIAID;
        var assign = request.body.ASSIGN;
        var params = [request.params.hackathonId, request.body.CRITERIAID];
        var checkMsg = '' +
                'select ' +
                    'id ' +
                'from ' +
                    'hackathoncriteria ' +
                'where ' +
                    'hackathonid = ? ' +
                    'AND criteriaid = ? ;';
        var postMsg = '' +
                'insert into hackathoncriteria (hackathonid, criteriaid) ' +
                'values (?, ?);';
        var deleteMsg = '' +
                'delete from hackathoncriteria ' +
                'where ' +
                    'hackathonid = ? ' +
                    'AND criteriaid = ? ;';
        db.queryDb(checkMsg, params, function(result) {
            if (result.length > 0) {
                if (assign) {
                    response.writeHead(202, {});
                    response.end();
                } else {
                    makeResponse(204, {}, deleteMsg);
                }
            } else {
                if (assign) {
                    makeResponse(201, {}, postMsg);
                } else {
                    response.writeHead(204, {});
                    response.end();
                }
            }
        });

        var makeResponse = function(rspCode, header, msg) {
            db.queryDb(msg, params, function(result) {
                response.writeHead(rspCode, header);
                response.end();
            });
        };
    };

    self.getCriteria = function getCriteria(request, response) {
        var criteriaId = request.params.criteriaId;
        var getMsg = '' +
                'SELECT ' +
                    'ID, ' +
                    'NAME, ' +
                    'DESCRIPTION ' +
                'FROM ' +
                    'CRITERIA ' +
                'WHERE ' +
                    'ID = ? ;';
        db.queryDb(getMsg, [criteriaId], function(result) {
            if (result.length < 1) {
                response.writeHead(404, {
                    "Content-Type": "application/json",
                    "Content-Length": 0
                });
                response.end();
            } else {
                var resultTxt = JSON.stringify(result, null, "  ");
                response.writeHead(200, {
                    "Content-Type": "application/json;charset=utf-8",
                    "Content-Length": resultTxt.length
                });
                response.end(resultTxt);
            }
        });
    };

    self.editCriteria = function editCriteria(request, response) {
        var criteriaId = request.params.criteriaId;
        var serializedUpdates = sqlHelper.serializeForUpdate(request.body);
        var updateMsg = '' +
                'UPDATE ' +
                    'CRITERIA ' +
                'SET ' +
                    'NAME = ?, ' +
                    'DESCRIPTION = ? ' +
                'WHERE ' +
                    'ID = ? ;';
        var params = [request.body.NAME, request.body.DESCRIPTION, criteriaId];
        db.queryDb(updateMsg, params, function(result) {
            response.writeHead(202, {
                "Content-Type": "application/json;charset=utf-8",
                "Content-Length": 0
            });
            response.end();
        });
    };

}
module.exports = CriteriaService;
