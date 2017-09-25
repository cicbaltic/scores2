app.controller ('judgeController', ['$scope', '$stateParams', 'judgeInfo', 'hackathonInfo',
    function($scope, $stateParams, judgeInfo, hackathonInfo) {
        $scope.title = 'Judges';
        $scope.empty = true;
        judgeInfo.getJudgeInfo($stateParams.hackathonId).success (function(response) {
            if (Object.keys(response).length > 0) {
                $scope.empty = false
                $scope.people = response;
            }
        });

        var audience;

        hackathonInfo.getHackathon($stateParams.hackathonId).success(function(hackathonData) {
            audience = hackathonData.VOTINGAUDIENCE
        });

        $scope.isJudgeVoting = function(){
            if(audience === 2){ //1 = JUDGES 2 = PULBIC
                return false;
            }else {
                return true;
            }
        }
        


    }
]);
