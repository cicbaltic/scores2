/*jshint browser: true, es5:true, plusplus: true*/
/*jshint latedef: nofunc*/
/*global angular, console*/
(function() {
    'use strict';

    angular.module('app.core.run').run(checkAuthentication);

    checkAuthentication.$inject = [
        '$rootScope',
        '$location',
        '$cookieStore',
        '$http',
        '$anchorScroll',
        'authenticationService'
    ];

    function checkAuthentication($rootScope, $location, $cookieStore, $http,
    $anchorScroll, authenticationService) {

        authenticationService.validateCredentials(function(a) {
            check();
            anchorScroll();
        });





        function check() {
            // authenticationService.validateCredentials(function(a) {});
            // keep user logged in after page refresh
            //$rootScope.globals = $cookieStore.get('globals') || {};
            // if ($rootScope.globals.currentUser) {
            //     $http.defaults.headers.common.Authorization = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
            // }


            $rootScope.$on('$locationChangeStart', function(event, next, current) {
                var currentHackathonID = parseInt(($location.path()).split("/")[2]);
                var currentUrlLast = $location.path().split("/").pop();
                var redirect = false;

                if ($rootScope.globals && $rootScope.globals.currentUser) {
                    switch (currentUrlLast) {
                        case 'judge': {
                            redirect = evaluatePath('JUDGE', currentHackathonID, $rootScope);
                            break;
                        }
                        case 'organiser': {
                            redirect = evaluatePath('ORGANIZER', currentHackathonID, $rootScope);
                            break;
                        }
                        case 'report': {
                            redirect = evaluatePath('ORGANIZER', currentHackathonID, $rootScope);
                            break;
                        }
                        case 'admin': {
                            redirect = evaluatePath('ADMIN', currentHackathonID, $rootScope);
                            break;
                        }
                        case 'login': {
                            redirect = true;
                            break;
                        }
                    }
                    $rootScope.$emit('headerLoginButtonChanger', 'dotMenu');
                } else {
                    switch (currentUrlLast) {
                        case 'judge': {
                            redirect = true;
                            break;
                        }
                        case 'organiser': {
                            redirect = true;
                            break;
                        }
                        case 'admin': {
                            redirect = true;
                            break;
                        }
                        case 'report': {
                            redirect = true;
                            break;
                        }
                    }
                }

                // if (!$rootScope.globals) {
                //     // TODO: Redirect
                //     var paths = $rootScope.tempLoginControl;
                //
                //     for (var x in paths) {
                //         if (currentUrlLast === paths[x]) {
                //             redirect = true;
                //             $rootScope.$emit('headerLoginButtonChanger', 'loginButton');
                //         }
                //     }
                //     $rootScope.$emit('headerLoginButtonChanger', 'loginButton');
                // }

                if (redirect) {
                    if (!isNaN(currentHackathonID)) {
                        $location.path('/event/' + currentHackathonID);
                    } else {
                        $location.path('/');
                    }
                    redirect = false;
                }
                // // Hamburger menu disabler
                if (!isNaN(currentHackathonID)) {
                    $rootScope.$emit('hamburgerMenuDisabler', 'enable');
                } else if (isNaN(currentHackathonID)) {
                    $rootScope.$emit('hamburgerMenuDisabler', 'disable');
                }
            });
        }

        function evaluatePath(roleId, currentHackathonID, $rootScope) {
            if ($rootScope.globals) {
                if ($rootScope.globals.roles) {
                    if ($rootScope.globals.roles.null !== undefined && roleId === 'ADMIN') {
                        return false;
                    } else if ($rootScope.globals.roles[currentHackathonID]) {
                        if ($rootScope.globals.roles[currentHackathonID][roleId]) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

        function anchorScroll() {
            $anchorScroll.yOffset = 50;   // always scroll by 50 extra pixels
        }
    }
}());
