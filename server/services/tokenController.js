/*jshint node: true, es5: true*/
'use strict';

var tokenService = require('./tokenService');
var authService = require('./authorizationService');

module.exports = {
    getToken: function(request, response) {
        var payload = request.headers;
        tokenService.getToken(payload, function(res) {
            var resultTxt = JSON.stringify(res, null, ' ');
            response.writeHead(200, {
                'Content-Type': 'application/json',
                'Content-Length': resultTxt.length
            });
            response.end(resultTxt);
        });
    },
    checkToken: function(request, response) {
        var payload = request.headers;
        tokenService.checkToken(payload, function(result) {
            response.writeHead(200, {});
            response.end(JSON.stringify(result, null, " "));
        });
    },
    getUserRoles: function(request, response) {
        var payload = request.headers;
        tokenService.checkToken(payload, function(result) {
            if (result.userAuth === true) {
                authService.getUserRoles({userId: result.userId}, function(res) {
                    var resultTxt = JSON.stringify(res, null, ' ');
                    response.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Content-Length': resultTxt.length
                    });
                    response.end(resultTxt);
                });
            } else {
                var resultTxt = JSON.stringify(result, null, ' ');
                response.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Content-Length': resultTxt.length
                });
                response.end(resultTxt);
            }
        });

    }
};
