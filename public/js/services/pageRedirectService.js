(function() {
    'use strict';
    angular.module('app').factory('pageRedirectService', [ '$location',
    '$stateParams', function($location, $stateParams) {
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
                    changeLocation('/admin', hackathonID);
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
                case 'landing': {
                    changeLocation('/landing', hackathonID);
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
