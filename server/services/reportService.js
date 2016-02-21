/* jshint node: true, es5: true */
'use strict';

var dataBaseService = require('./sqlService');
var hackathonService = require('./hackathonService');
var hackService = new hackathonService();

function reportService(req, res) {
    var generateSumStatements = function(payload, callback) {
        payload.hackathonId = payload.hackathonID;
        hackService.getHackathonCriteria(payload, function(result) {
            if (result.length > 0) {
                var query = '';
                for (var i = 0; i < result.length; i++) {
                    var col = '' +
                    'sum( ' +
                        'case score.criteriaid ' +
                            'when ' + result[i].criteriaId + ' ' +
                            'then score.score ' +
                            'else null ' +
                        'end ' +
                    ') as \"' + result[i].name + '\", ';
                    query += col;
                }
                query = query.substring(0, query.length - 2);
                callback(query);
            } else {
                callback(undefined);
            }
        });
    };

    var payload = { hackathonID: req.params.hackathonId };
    generateSumStatements(payload, function(result) {
        var statement = '' +
        'select ' +
            'users.name as "judgeName", users.surname as "judgeSurname", team.name as "teamName", ' +
            result + ' ' +
        'from ' +
            '( ' +
                'select  ' +
                    'access.userid, ' +
                    'hackathonteam.teamid, ' +
                    'access.hackathonid ' +
                'from ' +
                    'access ' +
                    'left join hackathonteam on hackathonteam.hackathonid = access.hackathonid ' +

                'where ' +
                    'access.hackathonid = ? ' +
                    'and access.roleid = 3 ' +
            ') jt left join ( ' +
                'select ' +
                    'score.* ' +
                'from ' +
                    'score ' +
                    'left join access on ' +
                        'score.userid = access.userid ' +
                        'and score.hackathonid = access.hackathonid ' +
                'where ' +
                    'access.roleid = 3 ' +
                    'and access.hackathonid = ? ' +

            ') score on score.userid = jt.userid and score.teamid = jt.teamid ' +
            'left join users on users.id = jt.userid ' +
            'left join team on team.id = jt.teamid ' +

        'group by ' +
            'users.name, users.surname, team.name;';

        //var parameters = [payload.hackathonID, payload.hackathonID];

        dataBaseService.queryDb(statement, [req.params.hackathonId, req.params.hackathonId], function(response) {
            var info;
            info = JSON.stringify(response);
            res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
            res.end(info);
        });
    });
}
module.exports = reportService;
