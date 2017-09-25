//NEW
app.controller('scoreTableController', ['$scope', '$stateParams', 'scoreInfo',
    'emailBird', 'criteriaService', 'hackathonInfo', 'pageRedirectService', 'dotMenuService', '$rootScope',
    function ($scope, $stateParams, scoreInfo, emailBird, criteriaService, hackathonInfo, pageRedirectService, dotMenuService, $rootScope) {

        var scopeHackathonId = $stateParams.hackathonId;

        $scope.hasScores = false;
        $scope.hasInfo = false;
        $scope.hasRendered = false;
        $scope.renderCallNo = 0;

        $scope.unit = function (value) { return value; };

        $scope.isLoaded = function () {
            if ($scope.hasScores === true && $scope.hasInfo === true && $scope.hasRendered === true) {
                return true;
            } else {
                return false;
            }
        }

        $scope.rendered = function () { //function called in renderCallBack directive ; after-render in html
            $scope.renderCallNo++;
            if ($scope.renderCallNo > 1) {
                $scope.hasRendered = true;
            }
        }

        function showLiveBtn() {
            var result = false;

            //console.log("$scope.info:", $scope.info);

            if ($scope.info) {
                //console.log("typeof $rootScope.globals:", typeof $rootScope.globals);
                //console.log("angular.equals($rootScope.globals, {}):", angular.equals($rootScope.globals, {}));
                //console.log("$rootScope.globals:", $rootScope.globals);
                if (typeof $rootScope.globals === 'undefined' || angular.equals($rootScope.globals, {})) {
                    result = false;
                } else {
                    if (!isNaN(scopeHackathonId)) {
                        if ($rootScope.globals.roles) {
                            var rolesInHackathon = $rootScope.globals.roles[scopeHackathonId];
                            if (rolesInHackathon) {
                                //console.log("rolesInHackathon.ORGANIZER:", rolesInHackathon.ORGANIZER);
                                //console.log("rolesInHackathon.JUDGE:", rolesInHackathon.JUDGE);
                                //console.log("rolesInHackathon.ADMIN:", rolesInHackathon.ADMIN);
                                if (rolesInHackathon.ORGANIZER) {
                                    result = rolesInHackathon.ORGANIZER === true;
                                }
                            }
                        }
                    }
                }
            }

            //console.log("showLiveBtn.result:", result);

            return result;
        }

        $scope.showLiveBtn = showLiveBtn;

        $scope.redirectToLive = function () {
            if (showLiveBtn()) {
                pageRedirectService.redirect('live', scopeHackathonId);
            } else {
                pageRedirectService.redirect('home', scopeHackathonId);
            }
        };

        $scope.refreshScores = function () {
            if (showLiveBtn()) {
                criteriaService.getCriteria(scopeHackathonId).success(function (criteriaData) {
                    callInfoOfScoresGetterLive(criteriaData);
                    $scope.hasScores = true;
                });
            } else {
                pageRedirectService.redirect('home', scopeHackathonId);
            }
        }

        //$scope.refreshScoresCriteriaVisibility = "visible";
        //$scope.refreshScoresCriteriaDisplay = "block";
        $scope.refreshScoresCriteriaVisibility = "collapse";
        $scope.refreshScoresCriteriaDisplay = "none";

        $scope.refreshScoresHideCriteria = function () {
            try {
                var checkbox = window.document.getElementById("refreshScoresHideCriteria");
                if (checkbox) {
                    $scope.refreshScoresCriteriaVisibility = checkbox.checked ? "collapse" : "visible";
                    $scope.refreshScoresCriteriaDisplay = checkbox.checked ? "none" : "block";
                }
            } catch (e) {
            }
        };

        $scope.grandTotal = "0";

        function callInfoOfScoresGetterLive(critData) {
            scoreInfo.getScore(scopeHackathonId).success(function (scoreData) {

                if (scoreData !== null && scoreData[0] !== undefined) {

                    // console.log("critData:", critData);
                    // Array of:
                    // [0]
                    // criteriaId: 1
                    // criteriaRelationId: 1
                    // description: "Criterion-1-desc"
                    // hackathonId: 1
                    // name: "Criterion-1"
                    // [1]
                    // criteriaId: 2
                    // criteriaRelationId: 2
                    // description: "Criterion-2-desc"
                    // hackathonId: 1
                    // name: "Criterion-2"

                    // console.log("scoreData:", scoreData);
                    // Array of:
                    // [0]
                    // "Criterion-1": 1.000
                    // "Criterion-2": 1.000
                    // "DESCRIPTION": "Team-A-desc"
                    // "NAME": "Team-A"
                    // "Total": 2
                    // [1]
                    // "Criterion-1": 1.000
                    // "Criterion-2": 1.000
                    // "DESCRIPTION": "Team-B-desc"
                    // "NAME": "Team-B"
                    // "Total": 2

                    var scoreDataKeys = Object.keys(scoreData[0]);
                    //console.log("scoreDataKeys: ", scoreDataKeys);
                    var filteredScoreDataKeys = [];
                    var addedKeys = ["Total", "grandTotal", "totalPercentage", "totalPercentageText", "stars", "starsText"];
                    for (var i = 0; i < scoreDataKeys.length; i++) {
                        var key = scoreDataKeys[i];
                        if (addedKeys.indexOf(key) === -1) {
                            filteredScoreDataKeys.push(key);
                        }
                    }
                    //console.log("filteredScoreDataKeys:", filteredScoreDataKeys);

                    // Normalize data and calculate row totals.
                    //console.log("Before normalize data ==> scoreData: ", scoreData);
                    for (var i = 0; i < scoreData.length; i++) {
                        var scoreDataRow = scoreData[i];
                        var rowTotal = 0;
                        for (var keyIdx = 0; keyIdx < filteredScoreDataKeys.length; keyIdx++) {
                            var key = filteredScoreDataKeys[keyIdx];
                            if (key !== 'NAME' && key !== 'DESCRIPTION') {
                                // Now all keys should be criteria names.
                                var criterionScore = scoreDataRow[key];
                                if (criterionScore) {
                                    var criterionScore_number = parseFloat(criterionScore);
                                    if (criterionScore_number) {
                                        rowTotal += criterionScore_number;
                                    }
                                }
                            }
                        }
                        scoreDataRow.Total = rowTotal;
                    }
                    //console.log("After normalize data ==> scoreData: ", scoreData);

                    var grandTotal = 0;
                    for (var i = 0; i < scoreData.length; i++) {
                        grandTotal += scoreData[i]["Total"];
                    }
                    //$scope.grandTotal = grandTotal.toFixed(grandTotal === Math.floor(grandTotal) ? 0 : 1);
                    var grandTotalFloor = Math.floor(grandTotal);
                    //console.log("grandTotal:", grandTotal);
                    //console.log("grandTotalFloor:", grandTotalFloor);
                    //console.log("grandTotalFloor === grandTotal:", grandTotalFloor === grandTotal);
                    //console.log("grandTotalFloor == grandTotal:", grandTotalFloor == grandTotal);
                    if (grandTotalFloor === grandTotal) {
                        $scope.grandTotal = grandTotal.toFixed();
                    } else {
                        $scope.grandTotal = grandTotal.toFixed(1);
                    }
                    //console.log("$scope.grandTotal:", $scope.grandTotal);

                    var max_totalPercentage = 0;
                    for (var i = 0; i < scoreData.length; i++) {
                        scoreData[i]["grandTotal"] = grandTotal;
                        var total = scoreData[i]["Total"];
                        var totalPercentage = grandTotal > 0 ? (total / grandTotal) : 0;
                        scoreData[i]["totalPercentage"] = totalPercentage;
                        scoreData[i]["totalPercentageText"] = (100.0 * totalPercentage).toFixed(1);
                        if (totalPercentage > max_totalPercentage)
                            max_totalPercentage = totalPercentage;
                    }

                    //console.log("max_totalPercentage:", max_totalPercentage);

                    var STARS_PER_LINE = 100
                    var starsFactor = max_totalPercentage > 0 ? (STARS_PER_LINE / max_totalPercentage) : 0;
                    for (var i = 0; i < scoreData.length; i++) {
                        var totalPercentage = scoreData[i]["totalPercentage"];
                        var stars = Math.floor(starsFactor * totalPercentage);
                        scoreData[i]["stars"] = stars;
                        var starsText = [];
                        for (var j = 0; j < stars; j++) {
                            starsText.push(j);
                        }
                        scoreData[i]["starsText"] = starsText;
                    }
                    // console.log("scoreData:", scoreData);

                    //var critDataKeys = Object.keys(critData[0]);
                    //console.log("critDataKeys:", critDataKeys);

                    $scope.filterType = "NAME";
                    $scope.filterType2 = "DESCRIPTION";
                    $scope.rows = scoreData;
                    $scope.cols = filteredScoreDataKeys;

                    //console.log("$scope.rows:", $scope.rows);
                    //console.log("$scope.cols:", $scope.cols);
                    //console.log("$scope:", $scope);

                    $scope.nameFilter = 'NAME';
                    $scope.descriptionFilter = 'DESCRIPTION';
                    $scope.totalFilter = "Total";

                    //sendSomeMail();
                    //var subCatContainer = $(".linked3");
                    //subCatContainer.scroll(function () {
                    //    subCatContainer.scrollLeft($(this).scrollLeft());
                    //});
                }

            });
        };

        // Get Criterias
        criteriaService.getCriteria(scopeHackathonId).success(function (criteriaData) {
            //alert("scopeHackathonId:" + scopeHackathonId + "criteriaData:" + criteriaData);
            callInfoOfScoresGetter(criteriaData);
            $scope.hasScores = true;
        });

        hackathonInfo.getHackathon(scopeHackathonId).success(function (hackathonData) {
            $scope.info = hackathonData;
            $scope.hasInfo = true;
        });

        function callInfoOfScoresGetter(critData) {
            scoreInfo.getScore(scopeHackathonId).success(function (scoreData) {

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
                    subCatContainer.scroll(function () {
                        subCatContainer.scrollLeft($(this).scrollLeft());
                    });
                }

            });
        };

        $scope.redirectToJudgePage = function () {
            if ($scope.info.VOTINGAUDIENCE === 2) { // PUBLIC
                pageRedirectService.redirect('voting');
            } else {
                pageRedirectService.redirect('judgepage');
            }
        };

        $scope.showVoteBtn = function () {
            if ($scope.info) {
                if ($scope.info.VOTINGAUDIENCE === 2) { // PUBLIC
                    if (typeof $rootScope.globals === 'undefined' || angular.equals($rootScope.globals, {})) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (typeof $rootScope.globals === 'undefined' || angular.equals($rootScope.globals, {})) {
                        return false;
                    } else {
                        if (!isNaN(scopeHackathonId)) {
                            if ($rootScope.globals.roles) {
                                if ($rootScope.globals.roles[scopeHackathonId]) {
                                    if ($rootScope.globals.roles[scopeHackathonId].JUDGE) {
                                        if ($rootScope.globals.roles[scopeHackathonId].JUDGE === true) {
                                            return true;
                                        }
                                    }
                                }
                            }
                        }
                        return false;
                    }
                }
            } else {
                return false;
            }
        };

    }]);

app.filter('roundSomeNumbers', function ($filter) {
    return function (input) {
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
