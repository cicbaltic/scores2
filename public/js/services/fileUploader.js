app.factory('fileUploader', ['$http', function($http) {
    return function(hackId, payload) {
        return $http.post('./images/' + hackId, payload, {
            headers: {'Content-Type': undefined },
        });
    };
}]);
