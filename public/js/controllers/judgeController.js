app.controller ('judgeController', ['$scope', '$stateParams', 'judgeInfo',
    function($scope, $stateParams, judgeInfo) {
        $scope.title = 'Judges';
        $scope.empty = true;
        judgeInfo.getJudgeInfo($stateParams.hackathonId).success (function(response) {
            if (Object.keys(response).length > 0) {
                $scope.empty = false
                $scope.people = response;
            }
        });
    }
]);
