/* jshint node:true, es5:true */
'use strict';
var db = require('./sqlService');

function TeamService() {
    var self = this;

    // team = {"name": "xyz", "description": "xyx"}
    self.newTeamCreate = function newTeamCreate(payload, callback) {
        self.createNewTeam(payload, function(newIdObject) {
            self.assignTeam({
                ASSIGN: true,
                TEAMID: newIdObject[0].ID,
                HACKATHONID: payload.hackathonId
            }, function(response) {
                callback(response);
            });
        });
    };

    // team = {"name": "xyz", "description": "xyx"}
    // returns the new team database row
    self.createNewTeam = function createNewTeam(team, callback) {
        var statements = [
            {
                statement: '' +
                    'insert into ' +
                        'team (name, description) ' +
                        'values (?, ?);',
                parameters: [team.name, team.description]
            },
            {
                statement: 'select * from team where id = identity_val_local();',
                parameters: []
            }
        ];
        db.transactDb(statements, function(response) {
            callback(response[1]);
        });
        return;
    };

    // team = {"teamId":123}
    self.getTeamInfo = function getTeamInfo(team, callback) {
        var queryStatement = '' +
            'select ' +
                'ID as "ID", ' +
                'name as "name", ' +
                'description as "description" ' +
            'from ' +
                'team ' +
            'where ' +
                'id = ?;';

        db.queryDb(queryStatement, [team.teamId], function(response) {
            callback(response);
        });
        return;
    };

    // team = {"name": "...", "description": "...", "teamID": "123"}
    self.updateTeamInfo = function updateTeamInfo(team, callback) {
        var statement = '' +
            'update ' +
                'team ' +
            'set ' +
                'name = ? , description = ? ' +
            'where ' +
                'id = ?;';
        db.queryDb(statement, [team.name, team.description, team.id], function(response) {
            callback(response);
        });
        return;
    };

    // payload = {"ASSIGN": bool, "TEAMID": 123, "HACKATHONID": 123}
    self.assignTeam = function assignTeam(payload, callback) {
        var assign = '' +
            'insert into ' +
                'hackathonteam (teamid, hackathonid) ' +
                'values (?,?);';
        var unAssign = '' +
            'delete ' +
            'from ' +
                'hackathonteam ' +
            'where ' +
                'teamid = ? ' +
                'AND hackathonid = ?;';
        if (payload.ASSIGN === true) {
            db.queryDb(assign, [payload.TEAMID, payload.HACKATHONID], function(response) {
                callback(response);
            });
        } else if (payload.ASSIGN === false) {
            db.queryDb(unAssign, [payload.TEAMID, payload.HACKATHONID], function(response) {
                callback(response);
            });
        } else {
            // shouldn't happen
        }
    };
}

module.exports = TeamService;
