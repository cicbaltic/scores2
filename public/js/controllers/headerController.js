(function() {
    'use strict';
    angular
        .module('app')
        .controller('headerController', ['pageRedirectService', '$scope',
        '$stateParams', '$state', '$http', '$location', '$anchorScroll',
        '$rootScope', 'authenticationService', 'dotMenuService',
        function(pageRedirectService ,$scope, $stateParams,
        $state, $http, $location, $anchorScroll, $rootScope,
        authenticationService, dotMenuService) {

            $scope.hc = {};
            $scope.hc.showDotMenu = false;
            $scope.hc.closeDotMenu = true;
            var currentHackathonID;

            // $scope.isAuthenticated = false;

            // $scope.isLoaded = function(){
            //     if($scope.isAuthenticated === true){
            //         return true;
            //     }else{
            //         return false;
            //     }
            // }

            function headerLogic(){
                var pathArr = $location.path().split("/");
                $scope.hc.showAdminOption = false;
                $scope.hc.showOrganiserOption = false;
                if(pathArr.length == 4){
                    var mainPath = pathArr[pathArr.length -1]; //last path item; role specific page
                }else{
                    var mainPath = pathArr[1]; //second path item; 
                }
                
                switch (mainPath){
                    case '':
                        $scope.hc.showCancelBtn = false;
                        $scope.hc.showBackBtn = false;
                        if($rootScope.globals){
                            if($rootScope.globals.roles){
                                if($rootScope.globals.roles.null){
                                    $scope.hc.showAdminOption = true;
                                }
                            }
                        }
                        break;
                    case 'login':
                        $scope.hc.showCancelBtn = true;
                        $scope.hc.showBackBtn = false;
                        $scope.hc.cancelBtnRedirect = 'landing';
                        break;
                    case 'event': 
                        $scope.hc.showCancelBtn = false;
                        $scope.hc.showBackBtn = true;
                        $scope.hc.backBtnRedirect = 'landing';
                        if($rootScope.globals){
                            if($rootScope.globals.roles){
                                if($rootScope.globals.roles[pathArr[2]]){
                                    if($rootScope.globals.roles[pathArr[2]].ORGANIZER){
                                        $scope.hc.showOrganiserOption = $rootScope.globals.roles[pathArr[2]].ORGANIZER;
                                    }
                                }
                                if($rootScope.globals.roles.null){
                                    $scope.hc.showAdminOption = true;
                                }
                            }
                        }
                        break;
                    case 'voting': 
                        backByOneUrl();
                        break;
                    case 'organiser': 
                        backByOneUrl();
                        break;
                    case 'admin': 
                        backByOneUrl();
                        break;
                    case 'judge': 
                        backByOneUrl();
                        break;
                    default:
                        $scope.hc.showCancelBtn = false;
                        $scope.hc.showBackBtn = false;
                        break;
                }

                function backByOneUrl(){
                    $scope.hc.showCancelBtn = false;
                    $scope.hc.showBackBtn = true;
                    $scope.hc.backBtnRedirect = pathArr.slice(1,-1).join("/");
                }
            };

            $scope.hc.absRedirect = function(redirectLocation){
                $location.path('/' + redirectLocation);
            }

            $rootScope.$on("$locationChangeSuccess", headerLogic);

            authenticationService.validateCredentials(function(a) {
                starter();
                // $scope.isAuthenticated = true;
            });


            function starter() {
                var currentHackathonID = parseInt(($location.path()).split("/")[2]);
                if ($rootScope.globals) {
                    $scope.hc.showHeaderLoginButton = false;
                    $scope.hc.showHeader3dotMenuButton = true;
                } else {
                    $scope.hc.showHeaderLoginButton = true;
                    $scope.hc.showHeader3dotMenuButton = false;
                }
                if (!isNaN(currentHackathonID)) {
                    $scope.hc.disableHamburgerMenu = false;
                    $scope.hc.showBackBtn = true;
                    $scope.hc.hamburgerMenuOpacity = '';
                } else if (isNaN(currentHackathonID)) {
                    $scope.hc.disableHamburgerMenu = true;
                    $scope.hc.showBackBtn = false;
                    $scope.hc.hamburgerMenuOpacity = 'header-hambureger-menu-opacity';
                }
                headerLogic();
            };
            $rootScope.$on('headerLoginButtonChanger', function(event, button) {
                if (button === 'dotMenu') {
                    $scope.hc.showHeaderLoginButton = false;
                    $scope.hc.showHeader3dotMenuButton = true;
                } else if (button === 'loginButton') {
                    $scope.hc.showHeaderLoginButton = true;
                    $scope.hc.showHeader3dotMenuButton = false;
                }
            });
            $rootScope.$on('dotMenuCloseControllerClicked', function(event) {
                 $scope.hc.hideDotMenu();
                 $rootScope.$emit('dotMenuCloseControllerDisable'); //emit to dotMenuCloseController
             });
            $rootScope.$on('hamburgerMenuDisabler', function(event, action) {
                if (action === 'disable') {
                    $scope.hc.disableHamburgerMenu = true;
                    $scope.hc.hamburgerMenuOpacity = 'header-hambureger-menu-opacity';
                } else if (action === 'enable') {
                    $scope.hc.disableHamburgerMenu = false;
                    $scope.hc.hamburgerMenuOpacity = '';
                }
            });
            $scope.jumpTo = function(elementID, closeDotMenu) {
                $location.hash(elementID);
                $anchorScroll();
                if (closeDotMenu) {
                    $scope.hc.hideDotMenu();
                }
            };
            $scope.hc.revealdotMenu = function() {
                var rolesForHackathon = dotMenuService.panelOptions();
                $scope.hc.gapp = ''; //add gapp above log out.
                if (rolesForHackathon.length > 0) {
                    $scope.hc.gapp = 'log-out-gapp';
                }

                $scope.hc.showDotMenu = true;
                $rootScope.$emit('dotMenuCloseControllerEnable');
                if ($state.current.name === 'landing') {
                    $scope.hc.gapp = 'log-out-gapp';
                    for (var i = 0; i < rolesForHackathon.length; i++) {
                        if(rolesForHackathon[i] === 'ADMIN'){
                            $scope.hc.showCreateEvent = true;
                        }
                    }
                } else {
                    for (var i = 0; i < rolesForHackathon.length; i++) {
                        switch (rolesForHackathon[i]) {
                            case 'ADMIN' : {
                                // $scope.hc.showActAs = true;
                                $scope.hc.showAdminOption = true;
                                break;
                            }
                            case 'ORGANIZER' : {
                                // $scope.hc.showActAs = true;
                                $scope.hc.showOrganiserOption = true;
                                break;
                            }
                            case 'JUDGE' : {
                                $scope.hc.showActAs = true;
                                $scope.hc.showJudgepageOption = true;
                                break;
                            }
                        }
                    }
                }
                // if ($state.current.name === 'landing') {
                //     $scope.hc.gapp = 'log-out-gapp';
                //     $scope.hc.showCreateEvent = true;
                // }
            };
            $scope.hc.hideDotMenu = function() {
                $scope.hc.showDotMenu = false;
                $scope.hc.showAdminOption = false;
                $scope.hc.showOrganiserOption = false;
                $scope.hc.showJudgepageOption = false;
                $scope.hc.showCreateEvent = false;
                // $scope.hc.showActAs = false;
                $rootScope.$emit('dotMenuCloseControllerDisable'); //emit to dotMenuCloseController
            };

            $scope.hc.redirect = function(redirectLocation) {
                if (redirectLocation === 'login') {
                    loginPageRestart();
                }
                pageRedirectService.redirect(redirectLocation);
                $scope.hc.hideDotMenu();
            };
            $scope.hc.logout = function() {
                $scope.hc.hideDotMenu();
                authenticationService.clearCredentials();
                $rootScope.$emit('headerLoginButtonChanger', 'loginButton');
                pageRedirectService.redirect('root');
                // if ($state.current.name === 'root' || $state.current.name === 'landing') {
                //     pageRedirectService.redirect('root');
                // } else {
                //     pageRedirectService.redirect('home');
                // }
            };
            $scope.hc.dotMenuCloser = function() {
                $scope.hc.closeDotMenu = false;
                $scope.hc.hideDotMenu();
                $scope.hc.hideDotMenu();
            };
            $scope.hc.createEvent = function() {
                $rootScope.openEventModal();// eventModalController.js
                $scope.hc.hideDotMenu();
            };
            function loginPageRestart() {
                // reset login view if reset password selected.
                $rootScope.$emit('loginPageRestart'); //emits to loginController.js
            }
        }]);
})();
