/* jshint node: true, es5: true */
'use strict';

var sqlService = require('./sqlService');
var HackathonService = require('./hackathonService');
var hackService = new HackathonService();

function ScoreService() {
    var self = this;

    // payload = { hackathonId: 123 };
    self.getCriteriaForScores = function getCriteriaForScores(payload, callback) {
        hackService.getHackathonCriteria(payload, function(result) {
            if (result.length > 0) {
                var query = '';
                for (var i = 0; i < result.length; i++) {
                    var col = '' +
                        'avg( ' +
                            'case score.criteriaid ' +
                                'when ' + result[i].criteriaId + ' ' +
                                    'then cast(score.score as decimal) ' +
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

    // payload = { hackathonId: 123 };
    self.getCriteriaForJudges = function getCriteriaForJudges(payload, callback) {
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
                    ') as \"' + result[i].criteriaId + '\", ';
                    query += col;
                }
                query = query.substring(0, query.length - 2);
                callback(query);
            } else {
                callback(undefined);
            }
        });
    };

    // payload = { hackathonId: 123 };
    self.getMainScores = function getMainScores(payload, callback) {
        self.getCriteriaForScores(payload, function(criteriaCols) {
            var statement = '' +
                'select ' +
                    'team.name' +
                    (criteriaCols ? (', ' + criteriaCols + ', ') : ', ') +
                    'team.description ' +
                'from ' +
                    'hackathonteam ' +
                    'left join team on ' +
                        'team.id = hackathonteam.teamid ' +
                    'left join (' +
                        'select ' +
                            'score.* ' +
                        'from ' +
                            'score ' +
                            'left join access on ' +
                                'score.userid = access.userid ' +
                                'and score.hackathonid = access.hackathonid ' +
                        'where ' +
                            'access.roleid = 3' +
                        ') score on ' +
                        'score.hackathonid = hackathonteam.hackathonid ' +
                        'and score.teamid = hackathonteam.teamid ' +
                    'left join criteria on ' +
                        'criteria.id = score.criteriaid ' +
                'where ' +
                    'hackathonteam.hackathonid = ? ' +
                'group by ' +
                    'team.name, ' +
                    'team.description;';
            sqlService.queryDb(statement, [payload.hackathonId], function(result) {
                callback(result);
            });
        });
    };

    // payload = { hackathonId: 123, userId = "xyz" };
    self.getScoresForJudge = function getScoresForJudge(payload, callback) {
        self.getCriteriaForJudges(payload, function(criteriaCols) {
            var statement = '' +
                'select ' +
                    'team.name, ' +
                    'team.id ' +
                    (criteriaCols ? (', ' + criteriaCols) : ' ') +
                'from ' +
                    'hackathonteam ' +
                    'left join team on ' +
                        'team.id = hackathonteam.teamid ' +
                    'left join (' +
                        'select ' +
                            'score.*' +
                        'from ' +
                            'score ' +
                            'left join access on ' +
                                'score.userid = access.userid ' +
                                'and score.hackathonid = access.hackathonid ' +
                        'where ' +
                            'access.roleid = 3 ' +
                            'and score.userid = ? ' +
                        ') score on ' +
                        'score.hackathonid = hackathonteam.hackathonid ' +
                        'and score.teamid = hackathonteam.teamid ' +
                    'left join criteria on ' +
                        'criteria.id = score.criteriaid ' +
                'where ' +
                    'hackathonteam.hackathonid = ? ' +
                'group by ' +
                    'team.name, ' +
                    'team.id;';
            sqlService.queryDb(statement, [payload.userId, payload.hackathonId], function(result) {
                // console.log(result);
                callback(result);
            });
        });
    };

    // payload = { hackathonId: 123, userId = "anonymous" };
    self.getScoresForAnonymous = function getScoresForAnonymous(payload, callback) {
        self.getCriteriaForJudges(payload, function (criteriaCols) {
            var statement = '' +
                'select ' +
                'team.name, ' +
                'team.id ' +
                (criteriaCols ? (', ' + criteriaCols) : ' ') +
                'from ' +
                'hackathonteam ' +
                'left join team on ' +
                'team.id = hackathonteam.teamid ' +
                'left join (' +
                'select ' +
                'score.*' +
                'from ' +
                'score ' +
                'left join access on ' +
                'score.userid = access.userid ' +
                'and score.hackathonid = access.hackathonid ' +
                'where ' +
                'access.roleid = 3 ' +
                'and score.userid = ? ' +
                ') score on ' +
                'score.hackathonid = hackathonteam.hackathonid ' +
                'and score.teamid = hackathonteam.teamid ' +
                'left join criteria on ' +
                'criteria.id = score.criteriaid ' +
                'where ' +
                'hackathonteam.hackathonid = ? ' +
                'group by ' +
                'team.name, ' +
                'team.id;';
            sqlService.queryDb(statement, ["anonymous", payload.hackathonId], function (result) {
                // console.log(result);
                callback(result);
            });
        });
    };


    /*
    self.getScoresForJudge = function getScoresForJudge(payload, callback) {
        self.getScoresForJudge2(payload, function(criteriaCols) {
            var statement = '' +
                'select ' +
                    'team.name, ' +
                    'criteria.id, ' +
                    'criteria.name, ' +
                    'criteria.description, ' +
                    'score.score ' +
                'from ' +
                    'hackathonteam ' +
                    'left join team on ' +
                        'team.id = hackathonteam.teamid ' +
                    'left join (' +
                        'select ' +
                            'score.*' +
                        'from ' +
                            'score ' +
                            'left join access on ' +
                                'score.userid = access.userid ' +
                                'and score.hackathonid = access.hackathonid ' +
                        'where ' +
                            'access.roleid = 3 ' +
                            'and score.userid = ? ' +
                        ') score on ' +
                        'score.hackathonid = hackathonteam.hackathonid ' +
                        'and score.teamid = hackathonteam.teamid ' +
                    'left join criteria on ' +
                        'criteria.id = score.criteriaid ' +
                'where ' +
                    'hackathonteam.hackathonid = ? ';
            sqlService.queryDb(statement, [payload.userId, payload.hackathonId], function(result) {
                // console.log(result);
                callback(result);
            });
        });
    };
    */



    /* payload
    [
        {
            UserID: "xyz",
            hackathonID: 123,
            criteriaID: 123,
            teamID: 123,
            Score: 123
        }
    ];   */
    self.setScore = function setScore(payload, callback) {
        // console.log("krc, payloadas is angular'o teisejo paneles\n  " + JSON.stringify(payload, null, "  "));
        var userID = payload[0].UserID;
        var hackathonID = payload[0].hackathonID;

        var insertValues = [];
        var updateValues = [];

        var splitResults = function (payload, result) {
            for (var i = 0; i < payload.length; i++) {
                var foundUpdate = false;
                var foundLine = false;
                for (var j = 0; j < result.length; j++) {

                    //var payloadLine = payload[i].criteriaID + '-' + payload[i].teamID;
                    //var checkLine = result[j].CRITERIAID + '-' + result[j].TEAMID;

                    //console.log("typeof payload[i].criteriaID: ", typeof payload[i].criteriaID);
                    //console.log("typeof result[j].CRITERIAID: ", typeof result[j].CRITERIAID);
                    //console.log("typeof payload[i].teamID: ", typeof payload[i].teamID);
                    //console.log("typeof result[j].TEAMID: ", typeof result[j].TEAMID);
                    //typeof payload[i].criteriaID:  string
                    //typeof result[j].CRITERIAID:  number
                    //typeof payload[i].teamID:  number
                    //typeof result[j].TEAMID:  number

                    //if (payloadLine === checkLine) { // 50 ms
                    if (payload[i].teamID == result[j].TEAMID && payload[i].criteriaID == result[j].CRITERIAID) { // 40 ms
                        foundLine = true;
                        if (payload[i].Score !== result[j].SCORE) {
                            foundUpdate = true;
                            //console.log("but of course");
                            var tmp = result[j];
                            tmp.SCORE = payload[i].Score;
                            updateValues.push(tmp);
                        }
                        j = result.length;
                    }
                }
                if (foundLine === false && payload[i].Score !== undefined && payload[i].Score !== null) {
                    insertValues.push(payload[i]);
                }
            }
        };
        // end of splitResults

        var generateInsertStatement = function(insertValues) {
            var statement = 'insert into ' +
                'score (hackathonid, teamid, criteriaid, userid, score) values ';
            var params = [];
            for (var i = 0; i < insertValues.length; i++) {
                var row = '(?, ?, ?, ?, ?), ';
                statement += row;
                params.push(hackathonID);
                params.push(insertValues[i].teamID);
                params.push(insertValues[i].criteriaID);
                params.push(userID);
                params.push(insertValues[i].Score);
            }
            statement = statement.substring(0, statement.length - 2) + ';';
            return { statement: statement, parameters: params };
        };

        var generateUpdateStatements = function(updateValues) {
            var statements = [];
            for (var i = 0; i < updateValues.length; i++) {
                statements.push({
                    statement: 'update score set score = ? where id = ?;',
                    parameters: [
                        updateValues[i].SCORE = (
                            updateValues[i].SCORE === undefined ? null : updateValues[i].SCORE
                        ),
                        updateValues[i].ID]
                });
            }
            return statements;
        };

        var generateLabelsForCheck = function(payload) {
            var labels = '';
            for (var i = 0; i < payload.length; i++) {
                var label = '' +
                    '\'' + payload[i].teamID + '-' +
                    payload[i].criteriaID + '\',';
                labels += label;
            }
            labels = labels.substring(0, labels.length - 1);
            return labels;
        };

        var checkStatement = '' +
            'select ' +
                'id, ' +
                'teamid, ' +
                'criteriaid, ' +
                'score ' +
            'from ' +
                'score ' +
            'where ' +
                'userid = ? ' +
                'and hackathonid = ? ' +
                'and concat(teamid, concat(\'-\', criteriaid)) in (' +
                generateLabelsForCheck(payload) + ') ' +
            'order by ' +
                'teamid, ' +
                'criteriaid;';

        sqlService.queryDb(checkStatement, [userID, hackathonID], function(result) {
            splitResults(payload, result);
            var transactionPayload = generateUpdateStatements(updateValues);
            if (insertValues.length > 0) {
                transactionPayload.push(generateInsertStatement(insertValues));
            }
            //console.log(JSON.stringify(transactionPayload, null, "  "));
            sqlService.transactDb(transactionPayload, function(result) {
                // console.log(JSON.stringify(result, null, " "));
                console.log(result);
                callback(result);
            });
        });
    };

    self.setScoresForAnonymous = function setScore(payload, callback) {
        var hackathonID = payload[0].hackathonID;

        var insertValues = [];
        var updateValues = [];

        var splitResults = function (payload, result) {
            for (var i = 0; i < payload.length; i++) {
                var foundUpdate = false;
                var foundLine = false;
                for (var j = 0; j < result.length; j++) {

                    //var payloadLine = payload[i].criteriaID + '-' + payload[i].teamID;
                    //var checkLine = result[j].CRITERIAID + '-' + result[j].TEAMID;

                    //console.log("typeof payload[i].criteriaID: ", typeof payload[i].criteriaID);
                    //console.log("typeof result[j].CRITERIAID: ", typeof result[j].CRITERIAID);
                    //console.log("typeof payload[i].teamID: ", typeof payload[i].teamID);
                    //console.log("typeof result[j].TEAMID: ", typeof result[j].TEAMID);
                    //typeof payload[i].criteriaID:  string
                    //typeof result[j].CRITERIAID:  number
                    //typeof payload[i].teamID:  number
                    //typeof result[j].TEAMID:  number

                    //if (payloadLine === checkLine) { // 50 ms
                    if (payload[i].teamID == result[j].TEAMID && payload[i].criteriaID == result[j].CRITERIAID) { // 40 ms
                        foundLine = true;
                        if (payload[i].Score !== result[j].SCORE) {
                            foundUpdate = true;
                            //console.log("but of course");
                            var tmp = result[j];
                            tmp.SCORE = payload[i].Score;
                            updateValues.push(tmp);
                        }
                        j = result.length;
                    }
                }
                if (foundLine === false && payload[i].Score !== undefined && payload[i].Score !== null) {
                    insertValues.push(payload[i]);
                }
            }
        };
        // end of splitResults


        var generateInsertStatement = function (insertValues) {
            var statement = 'insert into ' +
                'score (hackathonid, teamid, criteriaid, userid, score) values ';
            var params = [];
            for (var i = 0; i < insertValues.length; i++) {
                var row = '(?, ?, ?, ?, ?), ';
                statement += row;
                params.push(hackathonID);
                params.push(insertValues[i].teamID);
                params.push(insertValues[i].criteriaID);
                params.push("anonymous");
                params.push(insertValues[i].Score);
            }
            statement = statement.substring(0, statement.length - 2) + ';';
            return { statement: statement, parameters: params };
        };

        var generateUpdateStatements = function (updateValues) {
            var statements = [];
            for (var i = 0; i < updateValues.length; i++) {
                statements.push({
                    statement: 'update score set score = score + ? where id = ?;',
                    parameters: [
                        updateValues[i].SCORE = (
                            updateValues[i].SCORE === undefined ? null : updateValues[i].SCORE
                        ),
                        updateValues[i].ID]
                });
            }
            return statements;
        };

        var generateLabelsForCheck = function (payload) {
            var labels = '';
            for (var i = 0; i < payload.length; i++) {
                var label = '' +
                    '\'' + payload[i].teamID + '-' +
                    payload[i].criteriaID + '\',';
                labels += label;
            }
            labels = labels.substring(0, labels.length - 1);
            return labels;
        };

        var checkStatement = '' +
            'select ' +
            'id, ' +
            'teamid, ' +
            'criteriaid, ' +
            'score ' +
            'from ' +
            'score ' +
            'where ' +
            'userid = \'anonymous\' ' +
            'and hackathonid = ? ' +
            'and concat(teamid, concat(\'-\', criteriaid)) in (' +
            generateLabelsForCheck(payload) + ') ' +
            'order by ' +
            'teamid, ' +
            'criteriaid;';

        sqlService.queryDb(checkStatement, [hackathonID], function (result) {
            splitResults(payload, result);
            var transactionPayload = generateUpdateStatements(updateValues);
            if (insertValues.length > 0) {
                transactionPayload.push(generateInsertStatement(insertValues));
            }
            //console.log(JSON.stringify(transactionPayload, null, "  "));
            sqlService.transactDb(transactionPayload, function (result) {
                // console.log(JSON.stringify(result, null, " "));
                console.log(result);
                callback(result);
            });
        });
    };
}

module.exports = ScoreService;
