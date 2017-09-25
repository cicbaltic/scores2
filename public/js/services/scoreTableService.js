app.factory('scoreInfo', ['$http', function($http) {
    var scoreInfo = {};
    scoreInfo.getScore = function(id) {
        return $http.get('/api/hackathon/scores/' + id);
    };
    // payload = { hackathonId: 123, userId: "xyz" }
    scoreInfo.getScoresForJudge = function(payload) {
        return $http.post('/api/scores/getjudgescores', payload);
    };
    scoreInfo.setScoresForJudge = function(payload) {
        return $http.post('/api/scores/postjudgescores', payload);
    };
    // payload = { hackathonId: 123, userId: "xyz" }
    scoreInfo.getScoresForAnonymous = function (payload) {
        return $http.post('/api/scores/getanonymousscores', payload);
    };
    scoreInfo.setScoresForAnonymous = function (payload) {
        return $http.post('/api/scores/postanonymousscores', payload);
    };

    return scoreInfo;
}]);
