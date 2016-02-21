app.factory('criteriaService', ['$http', function($http) {

    var getCriteria = function(id) {
        return $http.get('/api/hackathon/criteria/' + id);
    };

    var setCriteria = function(id, payload) {
        return $http.post('/api/criteria/info/' + id, payload);
    };

    var unassignCriteria = function(hackId, payload) {
        return $http.post('/api/hackathon/criteria/' + hackId, payload);
    };

    var createNewCriteria = function(payload) {
        return $http.post('/api/criteria/new', payload);
    };

    var saveCriteria = function(allCriteria, hackathonId, index, callback) {
        var payload = {
            name: allCriteria[index].name,
            description: allCriteria[index].description,
            hackathonId: hackathonId
        };
        if (index < allCriteria.intactLength) {
            setCriteria(allCriteria[index].criteriaId, payload).success(function(response) {
                callback(response);
            });
        } else {
            createNewCriteria(payload).success(function(response) {
                callback(response);
            });
        }
    };

    var deleteCriteria = function(allCriteria, hackathonId, index, callback) {
        if (allCriteria[index].criteriaId) {
            var payload = {};
            payload.ASSIGN = false;
            payload.HACKATHONID = hackathonId;
            payload.CRITERIAID = allCriteria[index].criteriaId;
            unassignCriteria(hackathonId, payload).success(function(response) {
                callback(response);
            });
        } else {
            callback(response);
        }
    };

    return {
        getCriteria: getCriteria,
        setCriteria: setCriteria,
        unassignCriteria: unassignCriteria,
        createNewCriteria: createNewCriteria,
        saveCriteria: saveCriteria,
        deleteCriteria: deleteCriteria
    };
}]);
