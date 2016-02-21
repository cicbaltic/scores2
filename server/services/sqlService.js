/*jslint node: true, es5:true*/
'use strict';

var db = require('ibm_db');
//var db = new Pool();

var environment = require('./vcapService');
var vcap  = environment.getVCAP().sqldb[0].credentials;

var cn = '' +
    'DRIVER={DB2};' +
    'DATABASE=' + vcap.db +
    ';UID=' + vcap.username +
    ';PWD=' + vcap.password +
    ';HOSTNAME=' + vcap.hostname +
    ';port= ' + vcap.port;

function SqlService() {
    console.log("-----------\nINVOKING sqlService module\n-----------\n\n");
    var self = this;
    self.queryDb = function queryDb(statement, parameters, callback) {
        db.open(cn, function(err, conn) {
            if (err) {
                console.log('Can\'t open connection');
                callback(err);
                return console.log(err);
            }

            conn.query(statement, parameters, function(err, rows, moreResultSets) {
                if (err) {
                    console.log(statement);
                    console.log(err);
                    callback(err);
                } else {
                    callback(rows);
                }
                conn.close(function(data) {});
            });
        });
    };
    // statements = [{"statement": "...", "parameters": [...]}, ...]
    self.transactDb = function transactDb(statements, callback) {
        db.open(cn, function(err, conn) {
            if (err) {
                console.log('Can\'t open connection');
                console.log(statement);
                callback(err);
                return console.log(err);
            }

            conn.beginTransaction(function(err) {
                if (err) {
                    console.log('Can\'t begin transaction');
                    console.log(statement);
                    callback(err);
                    return console.log(err);
                }

                var result = [];

                for (var i = 0; i < statements.length; i++) {
                    var stmt = statements[i].statement;
                    var params = statements[i].parameters;
                    result.push(
                        conn.querySync(stmt, params)
                    );
                }

                conn.commitTransaction(function(err) {
                    if (err) {
                        console.log('Can\'t commit transaction');
                        // conn.rollbackTransaction(function(rollbackerror) {
                        //     if (rollbackerror) {
                        //         console.log('Can\'t rollback transaction');
                        //         callback(err);
                        //         return console.log(err);
                        //     } else {
                        //         console.log('Transaction rolled back');
                        //     }
                        // });
                        callback(err);
                        return console.log(err);
                    }
                    callback(result);
                    conn.closeSync();
                });
            });
        });
    };
}

module.exports = exports = new SqlService();
