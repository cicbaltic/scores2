app.factory('judgeService', [ '$http', 'userService', function($http, userService) {

    var assignJudge = function(payload) {
        return $http.post('/api/judge/assign', payload);
    };

    var saveJudge = function(allJudges, hackathonId, index, callback) {
        if (index < allJudges.intactLength && allJudges[index].USERID !== undefined) {
            // edit user info for assigned judge
            userService.updateUserInfo(
                {
                    name: allJudges[index].name,
                    surname: allJudges[index].surname,
                    description: allJudges[index].description,
                    userID: allJudges[index].USERID,
                    hackathonId: hackathonId
                }
            ).success(function(response) {
                callback(response);
            });
        } else if (index >= allJudges.intactLength && allJudges[index].USERID !== undefined) {
            // assign existing user
            assignJudge(
                {
                    ASSIGN: true,
                    HACKATHONID: hackathonId,
                    USERID: allJudges[index].USERID
                }
            ).success(function(response) {
                callback(response);
            });
        } else if (index >= allJudges.intactLength && allJudges[index].USERID === undefined) {
            // create new user
            userService.registerNewUser(
                {
                    name: allJudges[index].name,
                    surname: allJudges[index].surname,
                    description: allJudges[index].description,
                    email: allJudges[index].email,
                    hackathonId: hackathonId,
                    role: 3
                }
            ).success(function(response) {
                assignJudge(
                    {
                        ASSIGN: true,
                        HACKATHONID: hackathonId,
                        USERID: response.userID
                    }
                ).success(function(response2) {
                    callback(response);
                });
            });
        } else {
            // this should happen.
        }
    };

    var deleteJudge = function(allJudges, hackathonId, index, callback) {
        if (allJudges[index].USERID) {
            var payload = {};
            payload.ASSIGN = false;
            payload.HACKATHONID = hackathonId;
            payload.USERID = allJudges[index].USERID;
            assignJudge(payload).success(function(response) {
                callback(response);
            });
        } else {
            callback(response);
        }
    };

    return {
        assignJudge: assignJudge,
        saveJudge: saveJudge,
        deleteJudge: deleteJudge
    };
}]);
