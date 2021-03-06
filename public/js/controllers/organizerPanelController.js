(function() {
    /*jshint browser:true, es5:true*/
    'use strict';
    angular
        .module('app')
        .controller ('organizerPanelController', organizerPanelController);

    organizerPanelController.$inject = [
        '$scope', '$stateParams', 'judgeInfo', 'teamService', 'criteriaService',
        'hackathonInfo', 'autocomplete', 'judgeService', 'userService',
        'mentorService', 'fileUploader'
    ];

    function organizerPanelController(
        $scope, $stateParams, judgeInfo, teamService, criteriaService,
        hackathonInfo, autocomplete, judgeService, userService,
        mentorService, fileUploader
    ) {

        var scopeHackathonId;

        // starter
        (function() {
            $scope.buttons = {
                hackathon: { disable: true, saving: false, deleting: false },
                criteria: { disable: true, saving: [], deleting: [] },
                judges: { disable: true, saving: [], deleting: [] },
                teams: { disable: true, saving: [], deleting: [] },
                mentors: { disable: true, saving: [], deleting: [] }
            };
            scopeHackathonId = $stateParams.hackathonId;
            reloadHackathonInfo();
            reloadInfos('criteria');
            reloadInfos('judges');
            reloadUsers();
            reloadInfos('teams');
            reloadInfos('mentors');
        })();

        $scope.selectFile = function selectFile(params) {
            var fd = new FormData();
            fd.append("image", params[0]);
            $scope.newLogoData = fd;
        };

        function reloadInfos(array) {
            var fillScopeVar = function(response) {
                $scope[array + 'Original'] = response;
                $scope[array] = angular.copy($scope[array + 'Original']);
                $scope[array].intactLength = response.length;

                $scope.buttons[array].disable = false;
                $scope.buttons[array].saving = [];
                $scope.buttons[array].deleting = [];
                for (var a in $scope[array]) {
                    $scope.buttons[array].saving.push(false);
                    $scope.buttons[array].deleting.push(false);
                }
            };

            switch (array) {
                case 'criteria': {
                    criteriaService.getCriteria(scopeHackathonId).success(fillScopeVar);
                    $scope.newCriteria = false;
                    break;
                }
                case 'judges': {
                    judgeInfo.getJudgeInfo(scopeHackathonId).success(fillScopeVar);
                    $scope.newJudge = false;
                    break;
                }
                case 'teams': {
                    teamService.getTeamInfo(scopeHackathonId).success(fillScopeVar);
                    $scope.newTeam = false;
                    break;
                }
                case 'mentors': {
                    mentorService.getMentorInfo(scopeHackathonId).success(fillScopeVar);
                    $scope.newMentor = false;
                    break;
                }
                default: {

                }
            }
        }

        function reloadHackathonInfo() {
            hackathonInfo.getHackathon(scopeHackathonId).success(function(response) {
                $scope.hackathonOriginal = response;
                $scope.hackathon = angular.copy($scope.hackathonOriginal);
                $scope.buttons.hackathon.saving = false;
                $scope.editHackathon = false;
            });
        }

        function reloadUsers() {
            autocomplete.getUsers(scopeHackathonId).success(function(response) {
                $scope.autoJudges = response;
            });
        }

        $scope.save = function save(array, index, name, valid) {
            if (array === $scope.hackathon) {
                if (!valid) {
                    $scope.editHackathon = true;
                } else {
                    $scope.buttons.hackathon.saving = true;
                    $scope.buttons.hackathon.disable = true;
                    $scope.saveHackathon();
                }
            } else if (array === $scope.criteria) {
                if (!valid) {
                    $scope.newCriteria = true;
                } else {
                    $scope.buttons.criteria.saving[index] = true;
                    $scope.buttons.criteria.disable = true;
                    criteriaService.saveCriteria($scope.criteria, scopeHackathonId, index, function(r) {
                        reloadInfos('criteria');
                    });
                }
            } else if (array === $scope.judges) {
                if (!valid) {
                    $scope.newJudge = true;
                } else {
                    $scope.buttons.judges.saving[index] = true;
                    $scope.buttons.judges.disable = true;
                    judgeService.saveJudge($scope.judges, scopeHackathonId, index, function(r) {
                        reloadInfos('judges');
                    });
                }
            } else if (array === $scope.teams) {
                if (!valid) {
                    $scope.newTeam = true;
                } else {
                    $scope.buttons.teams.saving[index] = true;
                    $scope.buttons.teams.disable = true;
                    teamService.saveTeam($scope.teams, scopeHackathonId, index, function(r) {
                        reloadInfos('teams');
                    });
                }
            } else if (array === $scope.mentors) {
                if (!valid) {
                    $scope.newMentor = true;
                } else {
                    $scope.buttons.mentors.saving[index] = true;
                    $scope.buttons.mentors.disable = true;
                    mentorService.saveMentor($scope.mentors, scopeHackathonId, index, function(r) {
                        reloadInfos('mentors');
                    });
                }
            } else {
                // shouldnt reach this
            }
        };

        $scope.onSelectJudge = function onSelectJudge(source, model, label, index) {
            $scope.judges[index].name = source.NAME;
            $scope.judges[index].surname = source.SURNAME;
            $scope.judges[index].description = source.DESCRIPTION;
            $scope.judges[index].USERID = source.ID;
        };

        $scope.addNew = function addNew(elementArray) {
            if (elementArray.new) {
                return;
            } else {
                elementArray.new = true;
                elementArray.push({});
            }
        };

        $scope.removeElement = function removeElement(elementArray, index) {
            var label;
            if (elementArray[index].surname) {
                label = elementArray[index].name + ' ' + elementArray[index].surname;
            } else {
                label = elementArray[index].name;
            }
            if (label === undefined || confirm('Are you sure you want to delete \n' + label)) {
                if (elementArray === $scope.criteria) {
                    $scope.buttons.criteria.deleting[index] = true;
                    $scope.buttons.criteria.disable = true;
                    criteriaService.deleteCriteria($scope.criteria, scopeHackathonId, index, function(r) {
                        reloadInfos('criteria');
                    });
                } else if (elementArray === $scope.judges) {
                    $scope.buttons.judges.deleting[index] = true;
                    $scope.buttons.judges.disable = true;
                    judgeService.deleteJudge($scope.judges, scopeHackathonId, index, function(r) {
                        reloadInfos('judges');
                    });
                } else if (elementArray === $scope.teams) {
                    $scope.buttons.teams.deleting[index] = true;
                    $scope.buttons.teams.disable = true;
                    teamService.deleteTeam($scope.teams, scopeHackathonId, index, function(r) {
                        reloadInfos('teams');
                    });
                } else if (elementArray === $scope.mentors) {
                    $scope.buttons.mentors.deleting[index] = true;
                    $scope.buttons.mentors.disable = true;
                    mentorService.deleteMentor($scope.mentors, scopeHackathonId, index, function(r) {
                        reloadInfos('mentors');
                    });
                } else {
                    elementArray.splice(index, 1);
                }
            }
        };

        $scope.saveHackathon = function saveHackathon() {
            if ($scope.newLogoData) {
                fileUploader(scopeHackathonId, $scope.newLogoData).success(function(response) {
                    $scope.hackathon.image = './images/' + response.filename;
                    hackathonInfo.editHackathonInfo(scopeHackathonId, $scope.hackathon).success(function(response) {
                        reloadHackathonInfo();
                    });
                });
            } else {
                hackathonInfo.editHackathonInfo(scopeHackathonId, $scope.hackathon).success(function(response) {
                    reloadHackathonInfo();
                });
            }
        };
    }
})();
