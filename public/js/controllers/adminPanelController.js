(function() {
    'use strict';
    angular
        .module('app')
        .controller ('adminPanelController', ['$location', '$scope', 'adminPanelService', '$rootScope', 'autocomplete', '$window',
        function($location, $scope, adminPanelService, $rootScope, autocomplete, $window) {
            $scope.apc = {};
            $scope.hackathonInputHide = true;
            $scope.organiserEditTableHide = true;
            $scope.deleteButtonInEditHide = true;
            $scope.emailEditDisable = true;
            $scope.organiser = {};
            var hackathonID = parseInt(($location.path()).split("/")[2]);
            var requestParameters = {};
            starter();

            function starter() {
                autocomplete.getUsers(hackathonID).success(function(response) {
                    $scope.autocomplete = response;
                    $rootScope.$emit('autocompleteResponse', response); //emits to adminManagementController
                });
                requestParameters.actionToPerform = 'loadUserHackathon';
                requestParameters.hackathonListRequired = true;
                requestParameters.roleID = 2;
                requestParameters.hackathonID = hackathonID;
                adminPanelService.getInfo(requestParameters).success (function(response) {
                    $scope.people = response.user;
                    $scope.hackathonList = response.hackathon;
                    for (var i in $scope.hackathonList) {
                        if ($scope.hackathonList[i].ID == hackathonID) {
                            $scope.hackathonNameLabel = $scope.hackathonList[i].NAME;
                        }
                    }
                });
            }
            $scope.reveal = function(clickedName) {
                $scope.clearInvalidSelection();
                $scope.emailEditDisable = true;
                $scope.hackathonInputHide = true;
                $scope.organiserEditTableHide = false;
                $scope.deleteButtonInEditHide = false;
                $scope.actionButton = 'Save';
                $scope.userDisplay = clickedName.NAME + ' ' + clickedName.SURNAME;
                $scope.organiser.name = clickedName.NAME;
                $scope.organiser.surname = clickedName.SURNAME;
                $scope.organiser.email = clickedName.EMAIL;
                $scope.organiser.description = clickedName.DESCRIPTION;
                $scope.organiser.id = clickedName.ID;
            };
            $scope.changeHackathon = function(hackathon) {
                $scope.clearInvalidSelection();
                requestParameters.actionToPerform = 'loadUserHackathon';
                $scope.emailEditDisable = true;
                requestParameters.hackathonListRequired = false;
                $scope.deleteButtonInEditHide = true;
                $scope.organiserEditTableHide = true;
                $scope.hackathonNameLabel = hackathon.NAME;
                requestParameters.hackathonID = hackathon.ID;
                adminPanelService.getInfo(requestParameters).success (function(response) {
                    $scope.people = response.user;
                });
            };
            $scope.addUserHackathon = function(hackathon) {
                $scope.clearInvalidSelection();
                $scope.actionButton = 'Create';
                $scope.userDisplay = 'Create';
                $scope.addHackathonSelected = hackathon;
                $scope.emailEditDisable = false;
                $scope.deleteButtonInEditHide = true;
                $scope.organiserEditTableHide = false;
                clearFields();
                if (hackathon) {
                    $scope.hackathonInputHide = false;
                    $scope.userInputHide = true;
                }
                if (!hackathon) {
                    $scope.hackathonInputHide = true;
                    $scope.userInputHide = false;
                }
            };
            $scope.deleteUser = function(organiser) {
                $scope.clearInvalidSelection();
                if (confirm('Are you sure you want to delete \n' + $scope.userDisplay)) {
                    requestParameters.actionToPerform = 'deleteUser';
                    requestParameters.user = organiser;
                    adminPanelService.getInfo(requestParameters).success (function(response) {
                        $scope.people = response.user;
                        clearFields(true);
                    });
                }
            };
            $scope.addSaveUser = function(organiser, emailValid, nameValid, surnameValid, eventValid) {
                $scope.clearInvalidSelection();
                requestParameters.user = organiser;
                if ($scope.actionButton === 'Save') {
                    if (checkFieldValidation(organiser, emailValid, nameValid, surnameValid, eventValid)) {
                        return;
                    }
                    requestParameters.actionToPerform = 'updateUser';
                    adminPanelService.getInfo(requestParameters).success (function(response) {
                        $scope.people = response.user;
                        clearFields(true);
                    });
                } else if ($scope.actionButton === 'Create' && !$scope.addHackathonSelected) {
                    if (checkFieldValidation(organiser, emailValid, nameValid, surnameValid, eventValid)) {
                        return;
                    }
                    requestParameters.actionToPerform = 'addUser';
                    adminPanelService.getInfo(requestParameters).success (function(response) {
                        $scope.people = response.user;
                        clearFields(true);
                    });
                } else if ($scope.actionButton === 'Create' && $scope.addHackathonSelected) {
                    if (!eventValid) {
                        $scope.apc.eventNameRedBorderClass = 'has-error';
                        $scope.apc.showInvalidEventNameLabel = true;
                        return;
                    }
                    requestParameters.actionToPerform = 'addHackathon';
                    adminPanelService.getInfo(requestParameters).success (function(response) {
                        $scope.hackathonList = response.hackathon;
                        clearFields(true);
                    });
                }
            };
            $scope.onSelect = function($item, $model, $label) {
                $scope.organiser.name = $item.NAME;
                $scope.organiser.surname = $item.SURNAME;
                $scope.organiser.description = $item.DESCRIPTION;
            };
            $rootScope.$on('reloadAdminPanelList', function(event) { //refresh list
                requestParameters.hackathonListRequired = false;
                starter();
            });
            function clearFields(organiserEditTableHide) {
                $scope.organiserEditTableHide = organiserEditTableHide;
                $scope.organiser.name = '';
                $scope.organiser.surname = '';
                $scope.organiser.email = '';
                $scope.organiser.description = '';
                $scope.organiser.hackathonName = '';
                $scope.organiser.hackathonDescription = '';
                $rootScope.$emit('reloadManagementAdminPanelList'); //emit to adminManagementController
            }
            $scope.clearInvalidSelection = function() {
                $scope.apc.emailRedBorderClass = '';
                $scope.apc.showInvalidEmailLabel = false;
                $scope.apc.nameRedBorderClass = '';
                $scope.apc.showInvalidNameLabel = false;
                $scope.apc.surnameRedBorderClass = '';
                $scope.apc.showInvalidSurnameLabel = false;
                $scope.apc.showEmailDuiplicateLabel = false;
                $scope.apc.eventNameRedBorderClass = '';
                $scope.apc.showInvalidEventNameLabel = false;

            };
            function checkForDuplicate(email) {
                for (var person in $scope.people) {
                    if (email === $scope.people[person].EMAIL && $scope.actionButton === 'Create') {
                        return true;
                    }
                }
                return false;
            }
            function checkFieldValidation(organiser, emailValid, nameValid, surnameValid, eventValid) {
                if (!emailValid) {
                    $scope.apc.emailRedBorderClass = 'has-error';
                    $scope.apc.showInvalidEmailLabel = true;
                    return true;
                } else if (checkForDuplicate(organiser.email)) {
                    $scope.apc.emailRedBorderClass = 'has-error';
                    $scope.apc.showEmailDuiplicateLabel = true;
                    return true;
                } else if (!nameValid) {
                    $scope.apc.nameRedBorderClass = 'has-error';
                    $scope.apc.showInvalidNameLabel = true;
                    return true;
                } else if (!surnameValid) {
                    $scope.apc.surnameRedBorderClass = 'has-error';
                    $scope.apc.showInvalidSurnameLabel = true;
                    return true;
                }
                return false;
            }
        }]);
})();
