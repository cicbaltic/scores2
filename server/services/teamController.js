/* jshint node:true, es5:true */
'use strict';

var TeamService = require('./teamService');
var teamService = new TeamService();
//var SqlHelper = require('./helpers/sql');
//var sqlHelper = new SqlHelper();

function QueryService() {
    var self = this;

    var makeResponse = function(code, payload, response) {
        response.writeHead(code, {
            "Content-Type": "application/json;charset=utf-8",
            "Content-Length": payload.length
        });
        response.end(payload);
    };

    self.newTeamCreate = function newTeamCreate(request, response) {
        var payload = request.body;
        teamService.newTeamCreate(payload, function(result) {
            makeResponse(201, JSON.stringify(payload, null, "  "), response);
        });
    };

    self.createNewTeam = function createNewTeam(request, response) {
        console.log(JSON.stringify(request.body, null, "  "));
        var team = {
            name: request.body.name,
            description: request.body.description
        };
        teamService.createNewTeam(team, function(res) {
            var payload = JSON.stringify(res[0], null, "  ");
            makeResponse(201, payload, response);
        });
    };

    self.assignTeam = function assignTeam(request, response) {
        teamService.assignTeam(request.body, function(res) {
            var payload = JSON.stringify(res, null, "  ");
            makeResponse(201, payload, response);
        });
    };

    self.updateTeamInfo = function updateTeamInfo(request, response) {
        var payload = request.body;
        payload.id = request.params.teamID;

        teamService.updateTeamInfo(payload, function(res) {
            var payload = JSON.stringify(res, null, "  ");
            makeResponse(201, payload, response);
        });
    };
    // var message = req.body;
    // var querry =  {querry: 'someQuerry'};
    // var dbServeletJudges = require('./stubs/datBaseStubForTeams');
    // dbServeletJudges.sqlController(querry, function(results) {
    //     console.log("information That I got" + results);
    //     res.send(results);
    // });
    // this.getHackathonTeams = function getHackathonTeams(request, response) {
    //     var hackathonId = request.params.hackathonId;
    //     var selectMsg = {
    //         querry:
    //             'SELECT ' +
    //                 'ht.id as "relationalId", ' +
    //                 'ht.teamid as "teamId", ' +
    //                 't.name as "name", ' +
    //                 't.description as "description" ' +
    //             'FROM ' +
    //                 'team t ' +
    //                 'left join hackathonteam ht ' +
    //                     'on t.id = ht.teamid ' +
    //             'WHERE ' +
    //                 'ht.hackathonid = ' + hackathonId + ';'
    //     };
    //     db.sqlController(selectMsg, function(result) {
    //         if (result.length === 0) {
    //             response.writeHead(404, {
    //                 "Content-Type": "application/json",
    //                 "Content-Length": 0
    //             });
    //             response.end();
    //             return;
    //         } else {
    //             var resultTxt = JSON.stringify(result, null, "  ");
    //             response.writeHead(200, {
    //                 "Content-Type": "application/json",
    //                 "Content-Length": resultTxt.length
    //             });
    //             response.end(resultTxt);
    //             return;
    //         }
    //     });
    // };
    //
    // this.createNewTeam = function createNewTeam(request, response) {
    //     var colNames = sqlHelper.serializeForInsert(request.body)[0];
    //     var values = sqlHelper.serializeForInsert(request.body)[1];
    //     var insertMsg = {
    //         querry:
    //             "INSERT INTO team (" + colNames + ") " +
    //             "VALUES (" + values + ");"
    //     };
    //     db.sqlController(insertMsg, function(result) {
    //         response.writeHead(202, {
    //             "Content-Length": 0,
    //             "Content-Type": "application/json"
    //         });
    //         response.end();
    //     });
    // };
    //
    // this.assignHackathonTeam = function assignHackathonTeam(request, response) {
    //     var hackathonId = request.params.hackathonId;
    //     var teamId = request.body.TEAMID;
    //     var assign = request.body.ASSIGN;
    //     var checkMsg = {
    //         querry:
    //             'select ' +
    //                 'id ' +
    //             'from ' +
    //                 'hackathonteam ' +
    //             'where ' +
    //                 'hackathonid = ' + hackathonId + ' ' +
    //                 'AND teamid = ' + teamId + ';'
    //     };
    //
    //     var postMsg = {
    //         querry:
    //             'insert into hackathonteam (hackathonid, teamid) ' +
    //             'values (' + hackathonId + ', ' + teamId + ');'
    //     };
    //
    //     var deleteMsg = {
    //         querry:
    //             'delete from hackathonteam ' +
    //             'where ' +
    //                 'hackathonid = ' + hackathonId + ' ' +
    //                 'AND teamid = ' + teamId + ';'
    //     };
    //
    //     db.sqlController(checkMsg, function(result) {
    //         if (result.length > 0) {
    //             if (assign) {
    //                 response.writeHead(202, {});
    //                 response.end();
    //             } else {
    //                 makeResponse(204, {}, deleteMsg);
    //             }
    //         } else {
    //             if (assign) {
    //                 makeResponse(201, {}, postMsg);
    //             } else {
    //                 response.writeHead(204, {});
    //                 response.end();
    //             }
    //         }
    //     });
    //
    //     var makeResponse = function(rspCode, header, msg) {
    //         db.sqlController(msg, function(result) {
    //             response.writeHead(rspCode, header);
    //             response.end();
    //         });
    //     };
    // };
}

module.exports = QueryService;
