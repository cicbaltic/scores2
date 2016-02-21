app.factory('hackathonInfo', ['$http', function($http) {
    var hackathonInfo = {};
    hackathonInfo.getHackathon = function(id) {
        return $http.get('/api/hackathon/info/' + id);
    };

    hackathonInfo.editHackathonInfo = function(id, payload) {
        return $http.post('/api/hackathon/info/' + id, payload);
    };

    hackathonInfo.getAllHackathons = function() {
        return $http.get('/api/hackathons');
    };
    return hackathonInfo;
}]);
