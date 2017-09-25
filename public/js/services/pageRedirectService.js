(function() {
    'use strict';
    angular.module('app').factory('pageRedirectService', [ '$location',
    '$stateParams', '$rootScope', function($location, $stateParams, $rootScope) {
        var pageRedirectService = {};

        pageRedirectService.redirect = function(redirectLocation, optHackID) {
            var hackathonID = parseInt($stateParams.hackathonId);
            if (optHackID !== undefined) {
                hackathonID = optHackID;
            }

            switch (redirectLocation) {
                case 'home': {
                    changeLocation("", hackathonID);
                    break;
                }
                case 'login': {
                    changeLocation('/login', hackathonID);
                    break;
                }
                case 'admin': {
                    if(hackathonID){
                        changeLocation('/admin', hackathonID);
                    }else{
                        changeLocation('/admin', $rootScope.defaultHackathonId);
                    }
                    break;
                }
                case 'organiser': {
                    changeLocation('/organiser', hackathonID);
                    break;
                }
                case 'judgepage': {
                    changeLocation('/judge', hackathonID);
                    break;
                }
                case 'voting': {
                    changeLocation('/voting', hackathonID);
                    break;
                }
                case 'landing': {
                    changeLocation('/landing', hackathonID);
                    break;
                }
                case 'live': {
                    changeLocation('/live', hackathonID);
                    break;
                }
                case 'report': {
                    changeLocation('/report', hackathonID);
                    break;
                }
                case 'root': {
                    $location.path('/');
                    break;
                }
            }
        };
        function changeLocation(redirectLocation, hackathonID) {
            if (isNaN(hackathonID)) {
                $location.path(redirectLocation);
            } else {
                $location.path('event/' + hackathonID + redirectLocation);
            }
        }
        return pageRedirectService;
    }]);
})();
