app.factory('organisersInfo', ['$http', function($http) {
    var organisersInfo = {};
    organisersInfo.getOrganisersInfo = function(id) {
        return $http.get('./api/hackathon/organizers/' + id);
    };
    return organisersInfo;
}]);
