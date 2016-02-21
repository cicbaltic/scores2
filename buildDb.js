/*jslint node: true, es5:true*/
'use strict';

var db = require('ibm_db');
var imgService = require('./server/services/imageService');

var errors = [];

// module.exports = function(args) {
//     console.log(args);
//     readArguments(args, function(a) {
//         if (args[2] === 'install' && errors.length > 0) {
//             console.log('At least one table in the schema is already in place.\nAborting installation.');
//             // process.exit(1);
//         } else {
//             console.log('\nOperation perfomed successfully!\n');
//             require('./server/app');
//         }
//     });
// };

readArguments(process.argv, function(a) {
    if (process.argv[2] === 'install' && errors.length > 0) {
        console.log('At least one table in the schema is already in place.\nAborting installation.');
        // process.exit(1);
    } else {
        console.log('\nInstallation and setup of the database perfomed successfully!\n');
    }
});

function readArguments(args, callback) {
    var cmd = args[2];
    var email = args[3];
    var password = args[4];

    if (cmd === 'uninstall') { // drop database tables
        transactDb(generateDropStatements(), callback);
    } else if (cmd === 'install') { // set up database and roles and admin
        transactDb(generateSchemaStatements(email, password), callback);
        setTimeout(function() {
            createImageContainer(); // will create an image container, to avoid callback hell
        }, 5000);
    } else {
        console.log('Unrecognized command. Try again.');
        scriptUsage();
    }
}

function generateDropStatements() {
    return [
        { statement: 'drop table access;', parameters: [] },
        { statement: 'drop table criteria;', parameters: [] },
        { statement: 'drop table hackathon;', parameters: [] },
        { statement: 'drop table hackathoncriteria;', parameters: [] },
        { statement: 'drop table hackathonmentors;', parameters: [] },
        { statement: 'drop table hackathonteam;', parameters: [] },
        { statement: 'drop table mentors;', parameters: [] },
        { statement: 'drop table roles;', parameters: [] },
        { statement: 'drop table score;', parameters: [] },
        { statement: 'drop table team;', parameters: [] },
        { statement: 'drop table users;', parameters: [] },
    ];
}

function deleteImageContainer(callback) {
    imgService.deleteImageContainer();
}

function generateSchemaStatements(email, password) {
    var hash = require('./server/services/hashingService');
    var statmentPayload = [];
    var tableStatements = require('fs')
        .readFileSync('DB2 scheme', 'utf8')
        .replace(/\n/g, ' ')
        .split(';');
    tableStatements.splice(tableStatements.length - 1);
    for (var i = 0; i < tableStatements.length; i++) {
        statmentPayload.push({
            statement: tableStatements[i],
            parameters: []
        });
    }
    statmentPayload.push({
        statement: 'insert into roles (id, name, description) values ' +
            '(?, ?, ?), (?, ?, ?), (?, ?, ?);',
        parameters: [
            1, 'ADMIN', 'Administrator',
            2, 'ORGANIZER', 'Organiser',
            3, 'JUDGE', 'Judge'
        ]
    });
    statmentPayload.push({
        statement: 'insert into users (id, email, password) values(?, ?, ?);',
        parameters: [hash.hashEmail(email), email, hash.hashPassword(password)]
    });
    statmentPayload.push({
        statement: 'insert into access (userid, roleid) values (?, 1);',
        parameters: [hash.hashEmail(email)]
    });
    return statmentPayload;
}

function createImageContainer() {
    imgService.createContainer();
}

function transactDb(statements, callback) {
    db.open(getConn(), function(err, conn) {
        if (err) {
            console.log('Can\'t open connection');
            callback(err);
            return console.log(err);
        }
        conn.beginTransaction(function(err) {
            if (err) {
                console.log('Can\'t begin transaction');
                callback(err);
                conn.closeSync();
                return console.log(err);
            }
            var result = [];
            for (var i = 0; i < statements.length; i++) {
                var stmt = statements[i].statement;
                var params = statements[i].parameters;
                try {
                    result.push(
                        conn.querySync(stmt, params)
                    );
                } catch (e) {
                    errors.push(e);
                }
            }
            if (errors.length > 0) {
                conn.rollbackTransaction(function(err) {
                    if (err) {
                        //error during rollback
                        console.log(err);
                        return conn.closeSync();
                    } else {
                        console.log("Transactions rolled back.");
                    }
                });
            } else {
                conn.commitTransaction(function(err) {
                    if (err) {
                        console.log('Can\'t commit transaction');
                        callback(err);
                        return console.log(err);
                    }
                    callback(result);
                    conn.closeSync();
                    conn.close(function(data) {});
                });
            }
        });
    });
}

function getConn() {
    var vcap;
    try {
        vcap = JSON.parse(process.env.VCAP_SERVICES).sqldb[0].credentials;
    } catch (err) {
        vcap = JSON.parse(
            require('fs').readFileSync('dataBaseCreds', 'utf8')
        ).sqldb[0].credentials;
    }
    return '' +
        'DRIVER={DB2};' +
        'DATABASE=' + vcap.db +
        ';UID=' + vcap.username +
        ';PWD=' + vcap.password +
        ';HOSTNAME=' + vcap.hostname +
        ';port=' + vcap.port;
}

function scriptUsage() {
    console.log('' +
        '\nIBM SCORES v0.1 installation script.' +
        '\nCommands:\n' +
        '\n  -install: sets up the database schema, access roles and first admin user. Takes parameters:' +
            '\n    email: valid email address of the admin user;' +
            '\n    password: admin user password to log on;' +
            '\n  usage: npm run install-project -- install email@server.com password\n' +
        '\n  -uninstall: drops all the tables from the default database schema.\n'
    );
}
