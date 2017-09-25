(function() {
    app.controller ('judgeDashController', ['$rootScope', '$scope', '$stateParams',
    'judgeInfo', 'criteriaService', 'teamService', 'scoreInfo', 'hackathonInfo', 'authenticationService',
    function($rootScope, $scope, $stateParams, judgeInfo, criteriaService, teamService,
    scoreInfo, hackathonInfo, authenticationService) {

        var critData = [];
        var teams = [];
        var scoresInDB = [];
        var plainScore = [];

        $scope.hasCriteria = false;
        $scope.hasScores = false;
        $scope.hasInfo = false;
        $scope.hasRendered = false;
        $scope.renderCallNo = 0;

        $scope.isLoaded = function(){
            if($scope.hasScores === true && $scope.hasInfo === true && $scope.hasCriteria === true && $scope.hasRendered === true){
                return true;
            }else{
                return false;
            }
        }

        $scope.rendered = function(){ //function called in renderCallBack directive ; after-render in html
            $scope.renderCallNo++;
            if($scope.renderCallNo > 1){
                $scope.hasRendered = true;
            }
        }

        var scopeHackathonId = $stateParams.hackathonId;
        var scopeUser; //= $rootScope.globals.currentUser; //'29df44fe2e23acba0d8d3c8762334a8325ec5505'; //'82c424af94ea84bc0e7315956fdef6b9913575f2';
        $scope.savejudgeScore = false;
        // bootstrapper
        authenticationService.validateCredentials(function(a) {
            scopeUser = $rootScope.globals.currentUser;
            callInfoOfScoresGetter();
            $scope.hasScores = true;
        });

        //Get Criterias
        criteriaService.getCriteria(scopeHackathonId).success(function(criteriaData) {
            critData = criteriaData;
            $scope.hasCriteria = true;
            //getTeamInformation(criteriaData);
        });

        hackathonInfo.getHackathon(scopeHackathonId).success(function(hackathonData) {
            $scope.info = hackathonData;
            $scope.hasInfo = true;
        });

        $scope.increment = function (score, line, key) {
            if ($scope.info.VOTINGTYPE != 1) {
                if (score === $scope.info.SCOREMAX || score > $scope.info.SCOREMAX) {
                    line[key] = $scope.info.SCOREMAX;
                } else if (score === null) {
                    line[key] = 1;
                } else {
                    line[key] += 1;
                }
            } else {
                line[key] = 1;
            }
        };

        $scope.decrement = function (score, line, key) {
            if ($scope.info.VOTINGTYPE != 1) {
                if (score === $scope.info.SCOREMIN || score < $scope.info.SCOREMIN) {
                    line[key] = $scope.info.SCOREMIN;
                } else if (score === null) {
                    line[key] = 1;
                } else {
                    line[key] -= 1;
                }
            }else{
                line[key] = 0;
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
                if ($scope.info.VOTINGAUDIENCE == 1) { // Judges are voting
                    $scope.times = scoresFromDB.length;
                    $scope.lines = scoresFromDB;
                    $scope.coluas = Object($scope.rows[0]);
                    $scope.kegen = Object.keys($scope.rows[0]);

                    $scope.teamScores = {}; //create object for team scores
                    $scope.lines.forEach(function(team) {
                        $scope.teamScores[team.ID] = 0;
                        for(criteria in team){
                            if(criteria != "ID" && criteria != "NAME" && criteria != "$$hashKey"){
                                if(team[criteria] != null){
                                    $scope.teamScores[team.ID] += team[criteria];
                                }
                            }
                        }
                    });

                } else { // Public votes                   
                    $scope.times = scoresFromDB.length;

                    // Prepare clean data for anonymous voter
                    for (var i = 0; i < $scope.times; i++) {
                        scoresFromDB[i][1] = 0; // for to iterate through criterias from existing global variable
                    }

                    $scope.lines = scoresFromDB;
                    $scope.coluas = Object($scope.rows[0]);
                    $scope.kegen = Object.keys($scope.rows[0]);
                }
                return;
            });
        }

        $scope.getTeamScore = function(teamID){ // VOTINGTYPE == scores, count score sum for team
            $scope.lines.forEach(function(team) {
                if(team.ID == teamID){
                    $scope.teamScores[team.ID] = 0;
                    for(criteria in team){
                        if(criteria != "ID" && criteria != "NAME" && criteria != "$$hashKey"){
                            $scope.teamScores[team.ID] += team[criteria];
                        }
                    }
                }
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

            if ($scope.info.VOTINGAUDIENCE == 1) { // Judges are voting
                scoreInfo.setScoresForJudge(payload).success(function (result) {
                    $scope.savejudgeScore = false;
                });
            } else { // Public votes
                scoreInfo.setScoresForAnonymous(payload).success(function (result) {
                    $scope.savejudgeScore = false;
                });
            }
        };

        $scope.prepPayloadLike = function(line, key, isLike) {
            $scope.savejudgeScore = true;
            var payload = [];
            var cols = Object.keys(line);
            var team = line.ID;
            for (var col = 0; col < cols.length; col++) {
                if (cols[col] !== "NAME" && cols[col] !== "ID"  && cols[col].indexOf('$$') < 0) {
                    if(cols[col] == key){
                        var oneLoad = {};
                        oneLoad.UserID = scopeUser;
                        oneLoad.hackathonID = scopeHackathonId;
                        oneLoad.criteriaID = cols[col];
                        oneLoad.teamID = team;
                        if(isLike){
                            oneLoad.Score = 1;
                        }else{
                            oneLoad.Score = 0;
                        }
                        payload.push(oneLoad);
                    }
                }
            }

            if ($scope.info.VOTINGAUDIENCE == 1) { // Judges are voting
                scoreInfo.setScoresForJudge(payload).success(function (result) {
                    $scope.savejudgeScore = false;
                });
            } else { // Public votes
                scoreInfo.setScoresForAnonymous(payload).success(function (result) {
                    $scope.savejudgeScore = false;
                });
            }
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
