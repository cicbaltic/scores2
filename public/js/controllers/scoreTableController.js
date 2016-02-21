//NEW
app.controller('scoreTableController', ['$scope', '$stateParams', 'scoreInfo',
'emailBird', 'criteriaService', 'hackathonInfo',
function($scope, $stateParams, scoreInfo, emailBird, criteriaService, hackathonInfo) {

    var scopeHackathonId = $stateParams.hackathonId;
    // Get Criterias
    criteriaService.getCriteria(scopeHackathonId).success(function(criteriaData) {
        callInfoOfScoresGetter(criteriaData);
    });

    hackathonInfo.getHackathon(scopeHackathonId).success(function(hackathonData) {
        $scope.info = hackathonData;
    });

    function callInfoOfScoresGetter(critData) {
        scoreInfo.getScore(scopeHackathonId).success(function(scoreData) {

            if (scoreData !== null && scoreData[0] !== undefined) {
                //TemInformation
                var scoreDataKeys = Object.keys(scoreData[0]);
                //Sudarom normalia lentele
                for (var i = 0; i < scoreData.length; i++) {
                    dateSingleLine = scoreData[i];
                    var tempScore = 0;
                    for (var keys in scoreData[i]) {
                        if (keys != 'NAME' && keys != 'DESCRIPTION') {
                            var toAdd = (
                                scoreData[i][keys] !== null ? scoreData[i][keys] : 0
                            );
                            tempScore += parseFloat(toAdd);
                        }
                    }
                    dateSingleLine.Total = tempScore;
                }

                scoreDataKeys = Object.keys(scoreData[0]);
                var critDataKeys = Object.keys(critData[0]);
                $scope.filterType = scoreDataKeys[0];
                $scope.filterType2 = scoreDataKeys[scoreDataKeys.length - 1];
                $scope.rows = scoreData;
                $scope.cols = Object.keys($scope.rows[0]);

                $scope.nameFilter = 'NAME';
                $scope.descriptionFilter = 'DESCRIPTION';
                $scope.totalFilter = scoreDataKeys[scoreDataKeys.length - 1];
                //sendSomeMail();
                var subCatContainer = $(".linked3");
                subCatContainer.scroll(function() {
                    subCatContainer.scrollLeft($(this).scrollLeft());
                });
            }

        });
    }
}]);

app.filter('roundSomeNumbers', function($filter) {
    return function(input) {
        if (input % 1) {
            var digit = input.toString()[0];
            return $filter('number')(input, 1);
        }
        return $filter('number')(input, 0);
    };

    function decimalPlaces(num) {
        var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        if (!match) { return 0; }
        return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
    }
});
