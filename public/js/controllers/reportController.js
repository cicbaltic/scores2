(function() {
    'use strict';
    angular
        .module('app')
        .controller ('reportController', ['$scope', 'reportService', '$location', '$document',
            function($scope, reportService, $location, $document) {
                var rc = {};
                var eventID = parseInt(($location.path()).split("/")[2]);
                $scope.dataLoading = true;
                pageSetup();
                
                function pageSetup() {
                    $scope.dataLoading = true;
                    $scope.criterias = {};
                    $scope.judgeArray = [];
                    $scope.criteriaArray = [];
                    $scope.teamAray = [];
                    reportService.getData({id: eventID}, function(response) {
                        $scope.judges = response.data;
                        nestToObject();
                        $scope.dataLoading = false;
                    });
                }
                function nestToObject() {
                    $scope.nestedInfo = {};
                    for (var i = 0, l = $scope.judges.length; i < l; i++) {

                        if($scope.judges[i].judgeName === null && $scope.judges[i].judgeSurname === null){
                            var fullName = 'anonymous';
                        }else{
                            var fullName = $scope.judges[i].judgeName + ' ' + $scope.judges[i].judgeSurname;
                        }
                        if (Object.keys($scope.nestedInfo).length === 0) {
                            $scope.nestedInfo[fullName] = {};
                        }
                        for (var name in $scope.nestedInfo) {
                            if (name != fullName) {
                                $scope.nestedInfo[fullName] = {};
                            }
                        }
                    }
                    for (var i = 0, l = $scope.judges.length; i < l; i++) {
                        if($scope.judges[i].judgeName === null && $scope.judges[i].judgeSurname === null){
                            var fullName = 'anonymous';
                        }else{
                            var fullName = $scope.judges[i].judgeName + ' ' + $scope.judges[i].judgeSurname;
                        }
                        for (var key in $scope.judges[i]) {
                            if (key !== 'judgeName' && key !== 'judgeSurname' && key !== 'teamName') {
                                if ($scope.nestedInfo[fullName][key] === undefined) {
                                    $scope.nestedInfo[fullName][key] = {};
                                }
                                $scope.nestedInfo[fullName][key][$scope.judges[i].teamName] = $scope.judges[i][key];
                            }
                        }
                    }
                    $scope.judgeArray = Object.keys($scope.nestedInfo);
                    for (var key in $scope.nestedInfo) {
                        $scope.criteriaArray = Object.keys($scope.nestedInfo[key]);
                        for (var key2 in $scope.nestedInfo[key]) {
                            $scope.teamAray = Object.keys($scope.nestedInfo[key][key2]);
                            return;
                        }
                    }
                }
                $scope.createCSV = function() {
                    var string = '';
                    for (var key in $scope.judges[0]) {
                        string += '"' + key + '",';
                    }
                    string += '\n';
                    for (var i = 0; i < $scope.judges.length; i++) {
                        for (var key in $scope.judges[i]) {
                            if ($scope.judges[i][key] === null) {
                                string += ',';
                            } else {
                                string += '"' + $scope.judges[i][key] + '",';
                            }
                        }
                        string += '\n';
                    }
                    var myBlob = new Blob([string],{type: 'text/csv'});
                    var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
                    var anchor = document.createElement("a");
                    anchor.download = "data.csv";
                    anchor.href = blobURL;
                    document.body.appendChild(anchor);
                    anchor.click();
                    document.body.removeChild(anchor);
                };
                $scope.filterElement = {
                    'judge': function(judge) {
                        $scope.judgeFileFilterOn = true;
                        judge = $scope.filterElement.removeSpaces(judge);
                        for (var i = 0; i < $scope.judgeArray.length; i++) {
                            var arrayName = $scope.filterElement.removeSpaces($scope.judgeArray[i]);
                            if (arrayName !== judge) {
                                $scope.judgeToHide = judge;
                            }
                        }
                    },
                    'criteria': function(criteria) {
                        $scope.criteriaFileFilterOn = true;
                        criteria = $scope.filterElement.removeSpaces(criteria);
                        for (var i = 0; i < $scope.criteriaArray.length; i++) {
                            var arrayName = $scope.filterElement.removeSpaces($scope.criteriaArray[i]);
                            if (arrayName !== criteria) {
                                $scope.criteriaToHide = criteria;
                            }
                        }
                    },
                    'removeSpaces': function(string) {
                        return string.replace(/\s+/g, '').replace(/[^a-zA-Z0-9 ]/g, "");
                    },
                    'clearFilters': function() {
                        $scope.judgeFileFilterOn = false;
                        $scope.criteriaFileFilterOn = false;
                        $scope.judge = '';
                    }

                };
            }])
            .filter('removeSpace', function() {
                return function(text) {
                    return String(text).replace(/\s+/g, '').replace(/[^a-zA-Z0-9 ]/g, "");
                };
            })
            .filter('checkForNull', function() {
                return function(text) {
                    if (text === null) {
                        text = '-';
                    }
                    return text;
                };
            })
            .filter('stringCut', function() {
                return function(text) {
                    if (text.length > 17) {
                        text = text.slice(1, 17) + '...';
                    }
                    return text;
                };
            });
})();
