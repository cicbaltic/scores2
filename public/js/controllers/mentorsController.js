app.controller ('mentorsController', ['$scope', '$stateParams', 'mentorService',
function($scope, $stateParams, mentorsController) {
    var scopeHackathonId = $stateParams.hackathonId;

    $scope.title = 'Mentors';
    $scope.empty = true;
    mentorsController.getMentorInfo(scopeHackathonId).success (function(response) {
        if (Object.keys(response).length > 0) {
            $scope.empty = false
            $scope.people = response;
        }
    });
}]);
