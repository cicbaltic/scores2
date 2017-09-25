var db = require('./sqlService');
var SqlHelper = require('./helpers/sql');
var sqlHelper = new SqlHelper();

function HackathonService() {
    var self = this;

    var makeResponse = function(code, payload, response) {
        response.writeHead(code, {
            "Content-Type": "application/json;charset=utf-8",
            "Content-Length": payload.length
        });
        response.end(payload);
    };

    // payload = { hackathonId: 123 };
    this.getHackathonInfo = function getHackathonInfo(payload, callback) {
        var msg = '' +
            'select ' +
                'id, ' +
                'name, ' +
                'description, ' +
                'image as "image", ' +
                'VOTINGAUDIENCE, ' +
                'VOTINGTYPE, ' +
                'SCOREMIN, ' +
                'SCOREMAX ' +
            'from ' +
                'hackathon ' +
            'where ' +
                'id = ?;';
        db.queryDb(msg, [payload.hackathonId], function(result) {
            callback(result);
        });
    };

    this.createNewHackathon = function createNewHackathon(payload, callback) {
        var statements = [];

        var insertStatement = '' +
                'INSERT INTO ' +
                    'hackathon (name, description, image) ' +
                'VALUES (?, ?, ?);';

        var insertParams = [
            payload.NAME,
            payload.DESCRIPTION,
            payload.image
        ];

        var returnStatement = '' +
            'select * from hackathon where id = identity_val_local();';

        statements.push({
            statement: insertStatement,
            parameters: insertParams
        });

        statements.push({
            statement: returnStatement,
            parameters: []
        });

        db.transactDb(statements, function(result) {
            callback(result);
        });
    };

    self.serializeForUpdate = function serializeForUpdate(payload) {
        var cols = Object.keys(payload);
        var setStatement = '';
        var params = [];
        for (var i = 0; i < cols.length; i++) {
            setStatement += (cols[i] + ' = ?, ');
            params.push(payload[cols[i]]);
        }
        setStatement = setStatement.substring(0, setStatement.length - 2);
        returnStatement = {set: setStatement, params: params};
        return returnStatement;
    };

        // payload: { ID:123, NAME: "xyz", DESCRIPTION: "xyz", image: "xyz" }
    this.editHackathonInfo = function editHackathonInfo(payload, callback) {
        var hackathonId = payload.hackathonId;
        var VOTINGAUDIENCE = payload.VOTINGAUDIENCE;
        delete payload.hackathonId;
        delete payload.ID;
        payload = self.serializeForUpdate(payload);
        payload.params.push(hackathonId);
        var statement = '' +
            'UPDATE ' +
            'hackathon ' +
            'SET ' +
            payload.set + ' ' +
            'WHERE ' +
            'id = ?;';
        self.getHackathonInfo({ hackathonId: hackathonId }, function (result) {
            if (result.length < 1) {
                result.push('404');
                callback(result);
            } else {
                db.queryDb('select * from access where hackathonid = ' + hackathonId + ' and userid = \'anonymous\'', null, function (result) {
                    console.log("anonymousAccess");
                    console.log(result);
                    var anonymousAccess = result;
                    if (VOTINGAUDIENCE == 2) { // Public voting selected
                        console.log("audience == public");
                        if (anonymousAccess.length == 0) {
                            console.log("anonymous access not found");
                            console.log("adding access");
                            db.queryDb('insert into access (hackathonid, roleid, userid) values (' + hackathonId + ', 3, \'anonymous\')', null, function (result) {
                                console.log("access added");
                            });
                        }else{
                            console.log("access found, no action needed");
                        }
                    }
                    else{ // Closed voting selected
                        if (anonymousAccess.length > 0) {
                            console.log("audience == closed");
                            console.log("anonymous access found");
                            console.log("deleting access");
                            db.queryDb('delete from access where hackathonid = ' + hackathonId + ' and userid = \'anonymous\'', null, function (result) {
                                console.log("access deleted");
                            });
                        }else{
                            console.log("access not found, no action needed");
                        }
                    }
                });
                
                db.queryDb(statement, payload.params, function (result) {
                    callback(result);
                });
            }
        });
    };

    // payload = { hackathonId: 123 };
    this.getHackathonTeams = function getHackathonTeams(payload, callback) {
        var hackathonId = payload.hackathonId;
        var statement = '' +
            'SELECT ' +
                'ht.id as "relationalId", ' +
                'ht.teamid as "teamId", ' +
                't.name as "name", ' +
                't.description as "description" ' +
            'FROM ' +
                'team t ' +
                'left join hackathonteam ht ' +
                    'on t.id = ht.teamid ' +
            'WHERE ' +
                'ht.hackathonid = ? ' +
            'ORDER BY ' +
                'ht.ID;';
        db.queryDb(statement, [hackathonId], function(result) {
            callback(result);
            return;
        });
    };

    // payload = { hackathonId: 123 };
    this.getHackathonCriteria = function getHackathonCriteria(payload, callback) {
        var statement = '' +
            'SELECT ' +
                'hc.ID as "criteriaRelationId", ' +
                'hc.HACKATHONID as "hackathonId", ' +
                'hc.CRITERIAID as "criteriaId", ' +
                'c.NAME as "name", ' +
                'c.DESCRIPTION as "description" ' +
            'FROM ' +
                'HACKATHONCRITERIA hc ' +
                'left join CRITERIA c ' +
                    'on hc.criteriaid = c.id ' +
            'WHERE ' +
                'hc.HACKATHONID = ? ' +
            'ORDER BY ' +
                'hc.ID' +
            ';';
        db.queryDb(statement, [payload.hackathonId], function(result) {
            callback(result);
        });
    };

    // payload = { hackathonId: 123 };
    self.getHackathonOrganizers = function getHackathonOrganizers(payload, callback) {
        var statement = '' +
            'select ' +
                'users.name as "name", ' +
                'users.surname as "surname", ' +
                'users.id, ' +
                'users.description as "description" ' +
            'from ' +
                'users ' +
                'left join access on ' +
                    'access.userid = users.id ' +
            'where ' +
                'access.hackathonid = ? and ' +
                'access.roleid = 2;';
        db.queryDb(statement, [payload.hackathonId], function(result) {
            callback(result);
        });
    };

    // payload = { hackathonId: 123 };
    self.getHackathonMentors = function getHackathonMentors(payload, callback) {
        var statement = '' +
            'select ' +
                'mentors.name as "name", ' +
                'mentors.description as "description", ' +
                'mentors.id as "mentorId" ' +
            'from ' +
                'mentors ' +
                'left join hackathonmentors on ' +
                    'hackathonmentors.mentorid = mentors.id ' +
            'where ' +
                'hackathonmentors.hackathonid = ?;';
        db.queryDb(statement, [payload.hackathonId], function(result) {
            callback(result);
        });
    };

    //
    self.getHackathonList = function getHackathonList(callback) {
        var statement = '' +
            'select ' +
                'id as "id", ' +
                'name as "name", ' +
                'description as "description", ' +
                'image as "image", ' +
                'votingaudience, ' +
                'votingtype ' +
            'from ' +
                'hackathon ' +
            'order by ' +
                'id desc;';
        db.queryDb(statement, [], function(result) {
            callback(result);
        });
    };
}

module.exports = HackathonService;
