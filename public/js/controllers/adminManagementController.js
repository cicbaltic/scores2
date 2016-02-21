(function() {
    'use strict';
    angular
        .module('app')
        .controller ('adminManagementController', ['$location', '$scope', 'adminPanelService', '$rootScope', '$window',
        function($location, $scope, adminPanelService, $rootScope, $window) {
            $scope.adminEditTableHide = true;
            $scope.deleteButtonInEditHide = true;
            $scope.emailEditDisable = true;
            $scope.admin = {};
            $scope.autocomplete = {};
            $scope.amc = {};
            var hackathonID = null;
            var requestParameters = {};
            starter();

            function starter() {
                requestParameters.actionToPerform = 'loadUserHackathon';
                requestParameters.hackathonListRequired = false;
                requestParameters.roleID = 1;
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
                $scope.adminEditTableHide = false;
                $scope.deleteButtonInEditHide = false;
                $scope.actionButton = 'Save';
                $scope.userDisplay = clickedName.NAME + ' ' + clickedName.SURNAME;
                $scope.admin.name = clickedName.NAME;
                $scope.admin.surname = clickedName.SURNAME;
                $scope.admin.email = clickedName.EMAIL;
                $scope.admin.description = clickedName.DESCRIPTION;
                $scope.admin.id = clickedName.ID;
            };
            $scope.addUser = function() {
                $scope.clearInvalidSelection();
                $scope.actionButton = 'Create';
                $scope.userDisplay = 'Create';
                $scope.emailEditDisable = false;
                $scope.deleteButtonInEditHide = true;
                $scope.adminEditTableHide = false;
                clearFields();
            };
            $scope.deleteUser = function(admin) {
                $scope.clearInvalidSelection();
                if (confirm('Are you sure you want to delete \n' + $scope.userDisplay)) {
                    requestParameters.actionToPerform = 'deleteUser';
                    requestParameters.user = admin;
                    adminPanelService.getInfo(requestParameters).success (function(response) {
                        $scope.people = response.user;
                        clearFields(true);
                    });
                }
            };
            $scope.addSaveUser = function(admin, emailValid, nameValid, surnameValid) {
                $scope.clearInvalidSelection();
                if (!emailValid) {
                    $scope.amc.emailRedBorderClass = 'has-error';
                    $scope.amc.showInvalidEmailLabel = true;
                    return;
                } else if (checkForDuplicate(admin.email)) {
                    $scope.amc.emailRedBorderClass = 'has-error';
                    $scope.amc.showEmailDuiplicateLabel = true;
                    return;
                } else if (!nameValid) {
                    $scope.amc.nameRedBorderClass = 'has-error';
                    $scope.amc.showInvalidNameLabel = true;
                    return;
                } else if (!surnameValid) {
                    $scope.amc.surnameRedBorderClass = 'has-error';
                    $scope.amc.showInvalidSurnameLabel = true;
                    return;
                }
                requestParameters.user = admin;

                if ($scope.actionButton === 'Save') {
                    requestParameters.actionToPerform = 'updateUser';
                    adminPanelService.getInfo(requestParameters).success (function(response) {
                        $scope.people = response.user;
                        clearFields(true);
                    });
                } else if ($scope.actionButton === 'Create') {
                    requestParameters.actionToPerform = 'addUser';
                    adminPanelService.getInfo(requestParameters).success (function(response) {
                        $scope.people = response.user;
                        clearFields(true);
                    });
                }
            };
            $scope.onSelect = function($item, $model, $label) {
                $scope.admin.name = $item.NAME;
                $scope.admin.surname = $item.SURNAME;
                $scope.admin.description = $item.DESCRIPTION;
            };
            $rootScope.$on('reloadManagementAdminPanelList', function(event) {
                starter(); //receive from adminPanelController
            });
            $rootScope.$on('autocompleteResponse', function(event, response) {
                $scope.autocomplete = response; //receive from adminPanelController
            });
            $scope.clearInvalidSelection = function() {
                $scope.amc.emailRedBorderClass = '';
                $scope.amc.showInvalidEmailLabel = false;
                $scope.amc.nameRedBorderClass = '';
                $scope.amc.showInvalidNameLabel = false;
                $scope.amc.surnameRedBorderClass = '';
                $scope.amc.showInvalidSurnameLabel = false;
                $scope.amc.showEmailDuiplicateLabel = false;
            };
            function clearFields(adminEditTableHide) {
                $scope.adminEditTableHide = adminEditTableHide;
                $scope.admin.name = '';
                $scope.admin.surname = '';
                $scope.admin.email = '';
                $scope.admin.description = '';
                $rootScope.$emit('reloadAdminPanelList'); //emit to adminPanelController
            }
            function checkForDuplicate(email) {
                for (var person in $scope.people) {
                    if (email === $scope.people[person].EMAIL && $scope.actionButton === 'Create') {
                        return true;
                    }
                }
                return false;
            }
        }]);
})();
