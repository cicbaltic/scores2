app.factory('judgeInfo', [ '$http', function($http) {
    var judgeInfo = {};
    judgeInfo.getJudgeInfo = function(id) {
        return $http.get('/api/hackathon/judges/' + id);
    };
    return judgeInfo;
}]);
