app.factory('judgeService', [ '$http', 'userService', function($http, userService) {

    var assignJudge = function(payload) {
        return $http.post('/api/judge/assign', payload);
    };

    var getAccessByEmail = function(email) {
        var request = {};
        request.email = email;
        return $http.post('/api/judge/access', request);
    }

    var saveJudge = function(allJudges, hackathonId, eventName, index, callback) {
        
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
        } else if (index >= allJudges.intactLength) {
            getAccessByEmail(allJudges[index].email).success(function(response){
                if(response.length == 0){
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
                        ).success(function(responseAssign) {
                            userService.informAboutNewRole(
                                {
                                    name: allJudges[index].name,
                                    surname: allJudges[index].surname,
                                    email: allJudges[index].email,
                                    hackathonId: hackathonId,
                                    role: 'JUDGE'
                                }
                            ).success(function(responseInform){
                                callback(responseInform);
                            });
                        });
                    });
                }else{
                    var eventCase = {exists: false, admin: false, alreadyJudge: false};
                    for(var i = 0; i < response.length; i++){
                        if(response[i].ROLEID == 1){
                            eventCase.admin = true;
                        }
                        if(response[i].HACKATHONID == hackathonId){
                            eventCase.hasRole = true;
                        }
                        if(response[i].HACKATHONID == hackathonId && response[i].ROLEID == 3){
                            eventCase.alreadyJudge = true;
                        }
                    }
                    if(eventCase.alreadyJudge === true){
                        response = {error: true, message: "User already is Judge for this hackathon"};
                        callback(response);
                    }
                    //else if(eventCase.admin === true){
                         // cannot assign error
                        // response = {error: true, message: "Admin user, cannot be judge"};
                        // callback(response);
                    // }
                    else if(eventCase.hasRole === true && eventCase.admin === false){
                        // cannot assign error
                        response = {error: true, message: "User already has role for this hackathon"};
                        callback(response);
                    }else{
                        // assign existing user
                        assignJudge(
                            {
                                ASSIGN: true,
                                HACKATHONID: hackathonId,
                                USERID: allJudges[index].USERID
                            }
                        ).success(function(responseAsgn) {
                            userService.informAboutNewRole(
                                {
                                    name: allJudges[index].name,
                                    surname: allJudges[index].surname,
                                    email: allJudges[index].email,
                                    hackathonId: hackathonId,
                                    role: 'JUDGE'
                                }
                            ).success(function(responseInform){
                                callback(responseInform);
                            });
                        });
                    }
                }
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
