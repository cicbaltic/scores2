/* jshint node: true, es5: true */
'use strict';

var db = require('./sqlService');
var CriteriaService = require('./criteriaService');
var criteriaService = new CriteriaService();
var SqlHelper = require('./helpers/sql.js');
var sqlHelper = new SqlHelper();

function CriteriaController() {
    var self = this;

    var makeResponse = function(code, payload, response) {
        response.writeHead(code, {
            "Content-Type": "application/json;charset=utf-8",
            //"Content-Length": payload.length
        });
        response.end(payload);
    };

    this.newCriteriaCreate = function newCriteriaCreate(request, response) {
        var payload = request.body;

        criteriaService.newCriteriaCreate(payload, function(result) {
            var payload = JSON.stringify(result[0], null, "  ");
            makeResponse(201, payload, response);
        });

    };

    this.assignHackathonCriteria = function assignHackathonCriteria(request, response) {
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

    this.getCriteria = function getCriteria(request, response) {
        var criteriaId = request.params.criteriaId;
        var getMsg = '' +
                'SELECT ' +
                    'ID, ' +
                    'NAME as "name", ' +
                    'DESCRIPTION as "description" ' +
                'FROM ' +
                    'CRITERIA ' +
                'WHERE ' +
                    'ID = ? ;';
        db.queryDb(getMsg, [criteriaId], function(result) {
            var resultTxt = JSON.stringify(result, null, "  ");
            response.writeHead(200, {
                "Content-Type": "application/json;charset=utf-8",
                "Content-Length": resultTxt.length
            });
            response.end(resultTxt);
        });
    };

    this.editCriteria = function editCriteria(request, response) {
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
        var params = [request.body.name, request.body.description, criteriaId];
        db.queryDb(updateMsg, params, function(result) {
            response.writeHead(202, {
                "Content-Type": "application/json;charset=utf-8",
                "Content-Length": 0
            });
            response.end();
        });
    };

    // this.createNewCriteria = function createNewCriteria(request, response) {
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
}
module.exports = CriteriaController;
