app.controller ('organisersController', ['$scope', '$stateParams', 'organisersInfo', function($scope, $stateParams, organisersInfo) {
    var scopeHackathonId = $stateParams.hackathonId;

    $scope.title = 'Organisers';
    $scope.empty = true;
    organisersInfo.getOrganisersInfo(scopeHackathonId).success (function(response) {
        if (Object.keys(response).length > 0) {
            $scope.empty = false
            $scope.people = response;
        }
    });
}]);
