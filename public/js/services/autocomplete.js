app.factory('autocomplete', ['$http', function($http) {
    var autocomplete = {};

    autocomplete.getUsers = function(hackathonId) {
        return $http.get('/api/autocomplete/user/' + hackathonId);
    };

    return autocomplete;
}]);
