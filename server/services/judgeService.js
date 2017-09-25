/* jshint node: true, es5: true */
'use strict';

var db = require('./sqlService');
var userService = require('./userService');
var SqlHelper = require('./helpers/sql');
var sqlHelper = new SqlHelper();

function QueryService() {
    this.getHackathonJudges = function getHackathonJudges(request, response) {
        var hackathonId = request.params.hackathonId;
        var selectMsg = {
            querry:
                'SELECT ' +
                    'a.USERID, ' +
                    'u.NAME as "name", ' +
                    'u.SURNAME as "surname", ' +
                    'u.EMAIL as "email", ' +
                    'u.DESCRIPTION as "description"' +
                'FROM ' +
                    'ACCESS a ' +
                    'left join USERS u ' +
                        'on a.USERID = u.ID ' +
                'WHERE ' +
                    'a.HACKATHONID = ' + hackathonId + ' ' +
                    'AND a.ROLEID = 3 ' +
                'ORDER BY ' +
                    'a.ID; '
        };
        db.queryDb(selectMsg.querry, [], function(result) {
            var resultTxt = JSON.stringify(result, null, "  ");
            response.writeHead(200, {
                "Content-Type": "application/json",
                // "Content-Length": resultTxt.length
            });
            response.end(resultTxt);
        });
    };

    this.getJudgeAccessByEmail = function(request, response){
        var query = "SELECT USERS.ID, ACCESS.HACKATHONID, ACCESS.ROLEID " +
        "FROM USERS " +
        "LEFT JOIN ACCESS ON USERS.ID = ACCESS.USERID " +
        "WHERE USERS.EMAIL = '" + request.body.email+ "';";
        db.queryDb(query, [], function(result){
            var resultStr = JSON.stringify(result, null, " ");
            response.writeHead(200, {
                "Content-Type": "application/json",
            });
            response.end(resultStr);
        });
    }

    this.assignJudge = function assignJudge(request, response) {
        var role = {
            userID: request.body.USERID,
            hackathonID: request.body.HACKATHONID,
            roleID: 3
        };

        var respond = function(code) {
            response.writeHead(code, {
                "Content-Type": "application/json;charset=utf-8",
                "Content-Length": 0
            });
            response.end();
        };

        var assignJury = function(result) {
            if (result.length === 0) {
                userService.createRole(role, function(res) {
                    respond(201);
                });
            } else {
                respond(201);
            }
        };

        var unAssignJury = function(result) {
            if (result.length === 0) {
                respond(204);
            } else {
                userService.deleteRole(role, function(res) {
                    respond(204);
                });
            }
        };

        if (request.body.ASSIGN === true) {
            userService.checkRole(role, assignJury);
        } else if (request.body.ASSIGN === false) {
            userService.checkRole(role, unAssignJury);
        } else {
            respond(400);
        }
    };
}

module.exports = QueryService;
