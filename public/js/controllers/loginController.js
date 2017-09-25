(function() {
    'use strict';

    angular
        .module('app')
        .controller('loginController', ['authenticationService', '$scope',
        '$rootScope', '$location', '$route', 'pageRedirectService', '$stateParams',
        '$state', function(authenticationService, $scope, $rootScope, $location,
        $route, pageRedirectService, $stateParams, $state) {

            var currentHackathonID = parseInt(($location.path()).split("/")[2]);
            var resetState = false;
            $scope.settingCredentials = false;
            $scope.lc = {};
            pageSetup();

            $scope.isLoaded = function(){
                if($scope.settingCredentials === false){
                    return true;
                }else{
                    return false;
                }
            };

            function pageSetup() {
                $scope.lc.showFailedHideRestLabel = true;
                $scope.lc.hideResetPassLink = false;
                $scope.lc.hidePassInput = false;
                $scope.lc.showResetPassLabel2 = 'hidden';
                $scope.lc.buttonLabel = 'LOG IN';
                $scope.lc.formControl = 'form-control';
                showFailLogin(false);
                hidePassResetLabels();
                resetState = false;
            }
            $scope.cancel = function() {
                if (resetState) {
                    pageSetup();
                } else if (isNaN(currentHackathonID) || currentHackathonID === undefined) {
                    pageRedirectService.redirect('root');
                    $rootScope.$emit('headerLoginButtonChanger', 'loginButton');
                } else {
                    pageRedirectService.redirect('home');
                    $rootScope.$emit('headerLoginButtonChanger', 'loginButton');
                }
            };

            authenticationService.clearCredentials();

            $scope.submit = function(form) {
                if ($scope.lc.buttonLabel === 'LOG IN') {
                    showFailLogin(false);
                    authenticationService.login(form.username, form.password, function(response) {
                        if (response.status === 200 && response.data.userAuth === true) {
                            $rootScope.$emit('headerLoginButtonChanger', 'dotMenu');
                            $scope.settingCredentials = true;
                            authenticationService.setCredentials(response.data.token, function(res) {
                                $scope.settingCredentials = false;
                                if ($state.current.name === 'root' || $state.current.name === 'landing') {
                                    pageRedirectService.redirect('root');
                                } else {
                                    pageRedirectService.redirect('home');
                                }
                            });
                           
                        } else {
                            showFailLogin(true);
                        }
                    });
                } else if ($scope.lc.buttonLabel === 'RESET PASSWORD') {
                    $scope.resetPassword (false);
                }
            };
            $scope.resetPassword = function(showForm) {
                resetState = true;
                if (showForm) {
                    hidePassResetLabels();
                    $scope.lc.formControl = '';
                    $scope.lc.buttonLabel = 'RESET PASSWORD';
                    $scope.lc.hidePassInput = true;
                    $scope.lc.hideResetPassLink = true;
                    $scope.lc.showResetPassLabel1 = true;
                    showFailLogin(false);
                } else {
                    authenticationService.resetPassword($scope.form.username, function(response) {
                        if (response.status === 200) {
                            $scope.form.username = '';
                            $scope.form.password = '';
                            hidePassResetLabels();
                            pageSetup();
                            $scope.lc.showFailedHideRestLabel = false;
                            $scope.lc.showResetPassLabel2 = 'visable';
                        } else if (response.status === 400) {
                            hidePassResetLabels();
                            $scope.lc.showResetPassLabel3 = true;
                        } else {
                        }
                    });
                }
            };
            $rootScope.$on('loginPageRestart', function() {
                pageSetup(); //await from headerController.js
            });
            function showFailLogin(show) {
                if (show) {
                    $scope.lc.showFailedHideRestLabel = true;
                    $scope.lc.loginFail = 'login-creditentials-fail';
                    $scope.lc.failLabel = 'visable';
                } else {
                    $scope.lc.loginFail = 'login-creditentials';
                    $scope.lc.failLabel = 'hidden';
                }
            }
            function hidePassResetLabels() {
                $scope.lc.showFailedHideRestLabel = true;
                $scope.lc.showResetPassLabel3 = false;
                $scope.lc.showResetPassLabel1 = false;
                $scope.lc.showResetPassLabel2 = 'hidden';
            }
        }]);
})();
