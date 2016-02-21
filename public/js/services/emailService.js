app.factory('emailBird', ['$http', function($http) {
    var emailBird = {};
    emailBird.sendMail = function(payload) {
        return $http.post('/sendMail', { information: payload });
    };
    return emailBird;
}]);
