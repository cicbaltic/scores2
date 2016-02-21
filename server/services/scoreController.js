/* jshint node: true, es5: true */
'use strict';

var ScoreService = require('./scoreService');
var scoreService = new ScoreService();

function ScoreController() {
    var self = this;

    var makeResponse = function(code, payload, response) {
        response.writeHead(code, {
            "Content-Type": "application/json;charset=utf-8"
            //"Content-Length": payload.length ZIZ HERE IS ZE PROBLEM WE NEED TO FIX IT
        });
        response.end(payload);
    };

    self.getMainScores = function getMainScores(request, response) {
        var payload = { hackathonId: request.params.hackathonId };
        scoreService.getMainScores(payload, function(result) {
            var resultTxt = JSON.stringify(result, null, "  ");
            makeResponse(200, resultTxt, response);
        });
    };

    self.getScoresForJudge = function getScoresForJudge(request, response) {
        scoreService.getScoresForJudge(request.body, function(result) {
            var resultTxt = JSON.stringify(result, null, "  ");
            makeResponse(200, resultTxt, response);
        });
        console.log(request.authentication);
    };



    self.setScoresForJudge = function setScoresForJudge(request, response) {
        scoreService.setScore(request.body, function(result) {
            var resultTxt = JSON.stringify(result, null, "  ");
            makeResponse(201, resultTxt, response);
        });
    };
}

module.exports = ScoreController;
