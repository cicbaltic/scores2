/* jshint node:true, es5:true */
'use strict';

var mentorService = require('./mentorService');

var makeResponse = function(code, payload, response) {
    response.writeHead(code, {
        "Content-Type": "application/json;charset=utf-8",
        "Content-Length": payload.length
    });
    response.end(payload);
};

module.exports = {
    newMentorCreate: function(request, response) {
        var payload = request.body;
        mentorService.newMentorCreate(payload, function(result) {
            makeResponse(201, JSON.stringify(payload, null, "  "), response);
        });
    },

    createNewMentor: function(request, response) {
        var mentor = {
            name: request.body.name,
            description: request.body.description
        };
        mentorService.createNewMentor(mentor, function(res) {
            var payload = JSON.stringify(res[0], null, "  ");
            makeResponse(201, payload, response);
        });
    },

    assignMentor: function(request, response) {
        mentorService.assignMentor(request.body, function(res) {
            var payload = JSON.stringify(res, null, "  ");
            makeResponse(201, payload, response);
        });
    },

    updateMentorInfo: function(request, response) {
        var payload = request.body;
        payload.mentorId = request.params.mentorId;

        mentorService.updateMentorInfo(payload, function(res) {
            var payload = JSON.stringify(res, null, "  ");
            makeResponse(201, payload, response);
        });
    }
};
