app.factory('mentorService', ['$http', function($http) {

    var getMentorInfo = function(id) {
        return $http.get('/api/hackathon/mentors/' + id);
    };

    var createNewMentor = function(payload) {
        return $http.post('/api/mentor/new', payload);
    };

    var assignMentor = function(payload) {
        return $http.post('/api/mentor/assign', payload);
    };

    var updateMentorInfo = function(id, payload) {
        return $http.post('/api/mentor/info/' + id, payload);
    };

    var saveMentor = function(allMentors, hackathonId, index, callback) {
        var payload = {
            name: allMentors[index].name,
            description: allMentors[index].description,
            hackathonId: hackathonId
        };
        if (index < allMentors.intactLength) {
            updateMentorInfo(allMentors[index].mentorId, payload).success(function(response) {
                callback(response);
            });
        } else {
            createNewMentor(payload).success(function(response) {
                callback(response);
            });
        }
    };

    var deleteMentor = function(allMentors, hackathonId, index, callback) {
        if (allMentors[index].mentorId) {
            var payload = {};
            payload.ASSIGN = false;
            payload.HACKATHONID = hackathonId;
            payload.MENTORID = allMentors[index].mentorId;
            assignMentor(payload).success(function(response) {
                callback(response);
            });
        } else {
            callback(response);
        }
    };

    return {
        getMentorInfo: getMentorInfo,
        createNewMentor: createNewMentor,
        assignMentor: assignMentor,
        updateMentorInfo: updateMentorInfo,
        saveMentor: saveMentor,
        deleteMentor: deleteMentor
    };
}]);
