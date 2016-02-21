/* jshint node: true, es5: true */
'use strict';

var db = require('./sqlService');

function MentorService() {
    var self = this;

    // payload = { name: 'xyz', description: 'xyz', hackathonId: 123 }
    self.newMentorCreate = function newMentorCreate(payload, callback) {
        self.createNewMentor(payload, function(newIdObject) {
            self.assignMentor({
                ASSIGN: true,
                MENTORID: newIdObject[0].ID,
                HACKATHONID: payload.hackathonId
            }, function(response) {

                callback(response);
            });
        });
    };

    // payload = {"name": "xyz", "description": "xyx", hackathonId: 123} hackathonId needed for security
    // returns the new mentor database row
    self.createNewMentor = function createNewMentor(payload, callback) {
        var statements = [
            {
                statement: '' +
                    'insert into ' +
                        'mentors (name, description) ' +
                    'values ' +
                        '(?, ?);',
                parameters: [payload.name, payload.description]
            },
            {
                statement: 'select id from mentors where id = identity_val_local();',
                parameters: []
            }
        ];

        db.transactDb(statements, function(response) {
            callback(response[1]);
        });
        return;
    };

    // payload = {"mentorId":123}
    self.getMentorInfo = function getMentorInfo(payload, callback) {
        var queryStatement = '' +
            'select ' +
                'ID as "ID", ' +
                'name as "name", ' +
                'description as "description" ' +
            'from ' +
                'mentors ' +
            'where ' +
                'id = ?;';

        db.queryDb(queryStatement, [payload.mentorId], function(response) {
            callback(response);
        });
        return;
    };

    // payload = {"name": "...", "description": "...", "mentorId": "123"}
    self.updateMentorInfo = function updateMentorInfo(payload, callback) {
        var statement = '' +
            'update ' +
                'mentors ' +
            'set ' +
                'name = ? , ' +
                'description = ? ' +
            'where ' +
                'id = ?;';
        db.queryDb(statement, [payload.name, payload.description, payload.mentorId], function(response) {
            callback(response);
        });
        return;
    };

    // payload = {"ASSIGN": bool, "MENTORID": 123, "HACKATHONID": 123}
    self.assignMentor = function assignMentor(payload, callback) {
        var assign = '' +
            'insert into ' +
                'hackathonmentors (mentorid, hackathonid) ' +
            'values (?,?);';
        var unAssign = '' +
            'delete ' +
            'from ' +
                'hackathonmentors ' +
            'where ' +
                'mentorid = ? ' +
                'AND hackathonid = ?;';
        if (payload.ASSIGN === true) {
            db.queryDb(assign, [payload.MENTORID, payload.HACKATHONID], function(response) {
                callback(response);
            });
        } else if (payload.ASSIGN === false) {
            db.queryDb(unAssign, [payload.MENTORID, payload.HACKATHONID], function(response) {
                callback(response);
            });
        } else {
            // shouldn't happen
        }
    };
}

module.exports = exports = new MentorService();
