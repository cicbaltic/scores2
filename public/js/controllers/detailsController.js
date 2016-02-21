app.controller('detailsController', ['$scope', '$http', function($scope, $http) {
  $http.get('tempData(PLS Delete)/someDetails.json').success(function(data) {
    $scope.team = data;
  });
}]);
