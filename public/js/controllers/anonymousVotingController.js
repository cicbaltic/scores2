(function() {
    app.controller ('anonymousVotingController', ['$rootScope', '$scope', '$stateParams',
    'judgeInfo', 'criteriaService', 'teamService', 'scoreInfo', 'hackathonInfo', 'authenticationService', 'pageRedirectService',
    function($rootScope, $scope, $stateParams, judgeInfo, criteriaService, teamService,
    scoreInfo, hackathonInfo, authenticationService, pageRedirectService) {

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
        };

        $scope.rendered = function(){ //function called in renderCallBack directive ; after-render in html
            $scope.renderCallNo++;
            if($scope.renderCallNo > 1){
                $scope.hasRendered = true;
            }
        };

        var scopeHackathonId = $stateParams.hackathonId;
        var scopeUser; //= $rootScope.globals.currentUser; //'29df44fe2e23acba0d8d3c8762334a8325ec5505'; //'82c424af94ea84bc0e7315956fdef6b9913575f2';
        $scope.savejudgeScore = false;
        // bootstrapper
        if ($rootScope.globals) {
            authenticationService.validateCredentials(function (a) {
                scopeUser = $rootScope.globals.currentUser;
                callInfoOfScoresGetter();
            });
        } else {
            scopeUser = 'anonymous';
            callInfoOfScoresGetter();
        }

        //Get Criterias
        criteriaService.getCriteria(scopeHackathonId).success(function(criteriaData) {
            critData = criteriaData;
            $scope.hasCriteria = true;
            //getTeamInformation(criteriaData);
        });

        hackathonInfo.getHackathon(scopeHackathonId).success(function(hackathonData) {
            $scope.info = hackathonData;
            $scope.hasInfo = true;
            if($scope.info.VOTINGAUDIENCE === 2){ // PUBLIC
                if(typeof $rootScope.globals === 'undefined' || angular.equals($rootScope.globals, {})){
                    $rootScope.openCaptchaModal();
                }else{
                    pageRedirectService.redirect('home');
                }
            }else{
                pageRedirectService.redirect('login');
            }
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
            if (score === $scope.info.SCOREMIN || score < $scope.info.SCOREMIN) {
                line[key] = $scope.info.SCOREMIN;
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
            scoreInfo.getScoresForAnonymous(payload).success(function(scoresFromDB) {
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
                } else { // Public votes                   
                    $scope.times = scoresFromDB.length;

                    // Prepare clean data for anonymous voter
                    for (var i = 0; i < scoresFromDB.length; i++) { // for each team
                        for (key in scoresFromDB[i]) { 
                            if(key != "ID" && key != "NAME"){
                                scoresFromDB[i][key] = 0;
                            }
                        }
                        // scoresFromDB[i][1] = 0; // for to iterate through criterias from existing global variable
                    }

                    $scope.lines = scoresFromDB;
                    $scope.coluas = Object($scope.rows[0]);
                    $scope.kegen = Object.keys($scope.rows[0]);
                    
                    if($scope.info.VOTINGTYPE == 1){ // VOTINGTYPE == likes, 
                        $scope.btnLike = {}; //create object for like btn show/hide states
                        $scope.teamScores = {}; //create object for team scores
                        $scope.lines.forEach(function(team) {
                            $scope.teamScores[team.ID] = {score: 0, saved: false};
                            $scope.kegen.forEach(function(criteria) {
                                if(criteria != "ID" && criteria != "NAME"){
                                    $scope.btnLike['show_' + team.ID +'_'+ criteria] = true;
                                }
                            });
                        });

                        $scope.toggleLike = function(btnName){
                            $scope.btnLike[btnName] = !$scope.btnLike[btnName];
                        }
                    }else{ // VOTINGTYPE == scores, 
                        $scope.teamScores = {}; //create object for team scores
                        $scope.lines.forEach(function(team) {
                            $scope.teamScores[team.ID] = {score: 0, saved: false};
                        });
                    }
                }
                $scope.hasScores = true;
                return;
            });
        }

        $scope.getTeamScore = function(teamID){ // VOTINGTYPE == scores, count score sum for team
            $scope.lines.forEach(function(team) {
                if(team.ID == teamID){
                    $scope.teamScores[team.ID].score = 0;
                    for(criteria in team){
                        if(criteria != "ID" && criteria != "NAME" && criteria != "$$hashKey"){
                            $scope.teamScores[team.ID].score += team[criteria];
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

        $scope.prepPayload = function(line, isUndo) {
            $scope.savejudgeScore = true;
            var payload = [];
            // for (var i = 0; i < lines.length; i++) {
            var cols = Object.keys(line);
            var team = line.ID;
            for (var col = 0; col < cols.length; col++) {
                if (cols[col] !== "NAME" && cols[col] !== "ID"  && cols[col].indexOf('$$') < 0) {
                    var oneLoad = {};
                    oneLoad.UserID = scopeUser;
                    oneLoad.hackathonID = scopeHackathonId;
                    oneLoad.criteriaID = cols[col];
                    oneLoad.teamID = team;
                    if(isUndo === true && line[cols[col]] != 0){
                        oneLoad.Score = -line[cols[col]];
                    }else{
                        oneLoad.Score = line[cols[col]];
                    }
                    payload.push(oneLoad);
                }
            }
            // }
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
                            oneLoad.Score = -1;
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
