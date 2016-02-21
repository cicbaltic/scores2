/* jshint node: true, es5: true */
'use strict';

var db = require('./sqlService');
var SqlHelper = require('./helpers/sql');
var sqlHelper = new SqlHelper();
var HackathonService = require('./hackathonService');
var hackService = new HackathonService();

function HackathonController() {
    var self = this;

    var makeResponse = function(code, payload, response) {
        response.writeHead(code, {
            //"Content-Type": "application/json;charset=utf-8",
            //"Content-Length": payload.length
        });
        response.end(payload);
    };

    this.getHackathonInfo = function getHackathonInfo(request, response) {
        var hackathonId = request.params.hackathonId;
        hackService.getHackathonInfo({hackathonId: hackathonId}, function(result) {
            var resultTxt = JSON.stringify(result[0], null, "  ");
            makeResponse(200, resultTxt, response);
        });
    };

    this.createNewHackathon = function createNewHackathon(request, response) {
        hackService.createNewHackathon(request.body, function(result) {
            var resultTxt = JSON.stringify(result[1], null, "  ");
            makeResponse(201, resultTxt, response);
        });
    };

    this.editHackathonInfo = function editHackathonInfo(request, response) {
        var payload = request.body;
        payload.hackathonId = request.params.hackathonId;
        hackService.editHackathonInfo(payload, function(result) {
            var resultTxt = JSON.stringify(result, null, " ");
            makeResponse(201, resultTxt, response);
        });
    };

    this.getHackathonTeams = function getHackathonTeams(request, response) {
        var payload = { hackathonId: request.params.hackathonId };
        hackService.getHackathonTeams(payload, function(result) {
            var resultTxt = JSON.stringify(result, null, " ");
            makeResponse(200, resultTxt, response);
        });
    };

    this.getHackathonCriteria = function getHackathonCriteria(request, response) {
        var payload = { hackathonId: request.params.hackathonId };
        hackService.getHackathonCriteria(payload, function(result) {
            var resultTxt = JSON.stringify(result, null, "  ");
            makeResponse(200, resultTxt, response);
        });
    };

    this.getHackathonOrganizers = function getHackathonOrganizers(request, response) {
        var payload = { hackathonId: request.params.hackathonId };
        hackService.getHackathonOrganizers(payload, function(result) {
            var resultTxt = JSON.stringify(result, null, "  ");
            makeResponse(200, resultTxt, response);
        });
    };

    self.getHackathonMentors = function getHackathonMentors(request, response) {
        var payload = { hackathonId: request.params.hackathonId };
        hackService.getHackathonMentors(payload, function(result) {
            var resultTxt = JSON.stringify(result, null, " ");
            makeResponse(200, resultTxt, response);
        });
    };

    self.getHackathonList = function getHackathonList(request, response) {
        hackService.getHackathonList(function(results) {
            var resultTxt = JSON.stringify(results, null, "  ");
            makeResponse(200, resultTxt, response);
        });
    };
}

module.exports = HackathonController;
