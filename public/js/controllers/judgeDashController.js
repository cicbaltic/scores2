(function() {
    app.controller ('judgeDashController', ['$rootScope', '$scope', '$stateParams',
    'judgeInfo', 'criteriaService', 'teamService', 'scoreInfo', 'hackathonInfo', 'authenticationService',
    function($rootScope, $scope, $stateParams, judgeInfo, criteriaService, teamService,
    scoreInfo, hackathonInfo, authenticationService) {

        var critData = [];
        var teams = [];
        var scoresInDB = [];
        var plainScore = [];

        var scopeHackathonId = $stateParams.hackathonId;
        var scopeUser; //= $rootScope.globals.currentUser; //'29df44fe2e23acba0d8d3c8762334a8325ec5505'; //'82c424af94ea84bc0e7315956fdef6b9913575f2';
        $scope.savejudgeScore = false;
        // bootstrapper
        authenticationService.validateCredentials(function(a) {
            scopeUser = $rootScope.globals.currentUser;
            callInfoOfScoresGetter();
        });

        //Get Criterias
        criteriaService.getCriteria(scopeHackathonId).success(function(criteriaData) {
            critData = criteriaData;
            //getTeamInformation(criteriaData);
        });

        hackathonInfo.getHackathon(scopeHackathonId).success(function(hackathonData) {
            $scope.info = hackathonData;
        });

        $scope.increment = function(score, line, key) {
            if (score === 5) {
                line[key] = 5;
            } else if (score === null) {
                line[key] = 1;
            } else {
                line[key] += 1;
            }
        };

        $scope.decrement = function(score, line, key) {
            if (score === 1) {
                line[key] = 1;
            } else if (score === null) {
                line[key] = 1;
            } else {
                line[key] -= 1;
            }
        };

        teamService.getTeamInfo(scopeHackathonId).success(function(result) {
            teams = result;
        });


        // callInfoOfScoresGetter();
        function callInfoOfScoresGetter() {
            var payload = { hackathonId: scopeHackathonId, userId: scopeUser};
            scoreInfo.getScoresForJudge(payload).success(function(scoresFromDB) {
                scoresInDB = scoresFromDB;
                //==============================================
                var dataKeys = Object.keys(scoresFromDB[0]);
                dataKeys = Object.keys(scoresFromDB[0]);
                $scope.rows = scoresFromDB;
                $scope.cols = Object.keys($scope.rows[0]);
                //==============================================
                $scope.times = scoresFromDB.length;
                $scope.lines = scoresFromDB;
                $scope.coluas = Object($scope.rows[0]);
                $scope.kegen = Object.keys($scope.rows[0]);
                return;
            });
        }

        $scope.displayName = function(gotCritId) {
            for (var key in critData) {
                var obj = critData[key];
                if (obj.criteriaId == gotCritId) {
                    return obj.name;
                }
            }
        };

        $scope.displayDesc = function(gotCritId) {
            for (var key in critData) {
                var obj = critData[key];
                if (obj.criteriaId == gotCritId) {
                    return obj.description;
                }
            }
        };

        $scope.showChanged = function(infoToUpdate) {

        };

        $scope.prepPayload = function(lines) {
            $scope.savejudgeScore = true;
            var payload = [];
            for (var i = 0; i < lines.length; i++) {
                var cols = Object.keys(lines[i]);
                var team = lines[i].ID;
                for (var col = 0; col < cols.length; col++) {
                    if (cols[col] !== "NAME" && cols[col] !== "ID"  && cols[col].indexOf('$$') < 0) {
                        var oneLoad = {};
                        oneLoad.UserID = scopeUser;
                        oneLoad.hackathonID = scopeHackathonId;
                        oneLoad.criteriaID = cols[col];
                        oneLoad.teamID = team;
                        oneLoad.Score = lines[i][cols[col]];
                        payload.push(oneLoad);
                    }
                }
            }
            scoreInfo.setScoresForJudge(payload).success(function(result) {
                $scope.savejudgeScore = false;
            });
        };

        function findCriteriaID(crit) {
            var rows = critData.length;
            for (row = 0; row < rows; row++) {
                if (critData[row].name === crit) {
                    crit = critData[row].criteriaId;
                    return crit;
                }
            }
            return false;
        }

        function findTeamID(team) {
            var rows = teams.length;
            for (var row = 0; row < rows; row++) {
                if (teams[row].name === team) {
                    team = teams[row].teamId;
                    return team;
                }
            }
            return false;
        }
    }]);
})();
