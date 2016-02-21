app.controller('listController', ['$scope', '$http', function($scope, $http) {
    $http.get('tempData(PLS Delete)/phones.json').success(function(data) {
        $scope.phones = data;
    });
}]);
