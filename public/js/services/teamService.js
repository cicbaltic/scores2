app.factory('teamService', ['$http', function($http) {
    var getTeamInfo = function(id) {
        return $http.get('/api/hackathon/teams/' + id);
    };

    var createNewTeam = function(payload) {
        return $http.post('/api/team/new', payload);
    };

    var assignTeam = function(payload) {
        return $http.post('/api/team/assign', payload);
    };

    var updateTeamInfo = function(id, payload) {
        return $http.post('/api/team/info/' + id, payload);
    };

    var saveTeam = function(allTeams, hackathonId, index, callback) {
        var payload = {
            name: allTeams[index].name,
            description: allTeams[index].description,
            hackathonId: hackathonId
        };
        if (index < allTeams.intactLength) {
            updateTeamInfo(allTeams[index].teamId, payload).success(function(response) {
                callback(response);
            });
        } else {
            createNewTeam(payload).success(function(response) {
                callback(response);
            });
        }
    };

    var deleteTeam = function(allTeams, hackathonId, index, callback) {
        if (allTeams[index].teamId) {
            var payload = {};
            payload.ASSIGN = false;
            payload.HACKATHONID = hackathonId;
            payload.TEAMID = allTeams[index].teamId;
            assignTeam(payload).success(function(response) {
                callback(response);
            });
        } else {
            callback(response);
        }
    };

    return {
        getTeamInfo: getTeamInfo,
        createNewTeam: createNewTeam,
        assignTeam: assignTeam,
        updateTeamInfo: updateTeamInfo,
        saveTeam: saveTeam,
        deleteTeam: deleteTeam
    };
}]);
