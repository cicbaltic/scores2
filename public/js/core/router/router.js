/*jshint browser: true, es5:true*/
/*jshint latedef: nofunc*/
/*global angular */
(function () {
    'use strict';

    angular.module('app.core.router').config(configure);

    configure.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function configure($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('landing', {
                url: '/',
                templateUrl: 'templates/landingpage.html',
                controller: 'landingController'
            })
            .state('home', {
                url: '/event/:hackathonId',
                templateUrl: 'templates/bedsheet.html'
            })
            .state('organiser', {
                url: '/event/:hackathonId/organiser',
                templateUrl: 'templates/organiserPanelTemplate.html',
                controller: 'organizerPanelController',
                // resolve: ['$rootScope', '$stateParams', 'pageRedirectService', 'roleService', 'authenticationService',
                //     function($rootScope, $stateParams, pageRedirectService, roleService, authenticationService) {
                //         if (roleService.canAccess($stateParams.hackathonId, 'ORGANIZER') === false) {
                //             pageRedirectService.redirect('home', $stateParams.hackathonId);
                //         }
                //     }
                // ]
            })
            .state('admin', {
                url: '/event/:hackathonId/admin',
                templateUrl: 'templates/adminPanelSheetTemplate.html',
                // controller: 'adminPanelController',
                // resolve: ['$rootScope', '$stateParams', 'pageRedirectService', 'roleService', 'authenticationService',
                //     function($rootScope, $stateParams, pageRedirectService, roleService, authenticationService) {
                //         authenticationService.validateCredentials(function(a) {
                //             if (roleService.canAccess($stateParams.hackathonId, 'ADMIN') === false) {
                //                 pageRedirectService.redirect('home', $stateParams.hackathonId);
                //             }
                //         });
                //     }
                // ]
            })
            .state('judgePage', {
                url: '/event/:hackathonId/judge',
                templateUrl: 'templates/judgePageTemplate.html',
                controller: 'judgeDashController',
                // resolve: ['$rootScope', '$stateParams', 'pageRedirectService', 'roleService', 'authenticationService',
                //     function($rootScope, $stateParams, pageRedirectService, roleService, authenticationService) {
                //         authenticationService.validateCredentials(function(a) {
                //             if (roleService.canAccess($stateParams.hackathonId, 'JUDGE') === false) {
                //                 pageRedirectService.redirect('home', $stateParams.hackathonId);
                //             }
                //         });
                //     }
                // ]
            })
            .state('voting', {
                url: '/event/:hackathonId/voting',
                templateUrl: 'templates/votingPageTemplate.html',
                controller: 'anonymousVotingController',
            })
            .state('login', {
                url: '/event/:hackathonId/login',
                templateUrl: 'templates/loginTemplate.html',
                controller: 'loginController'
            })
            .state('loginEmpty', {
                url: '/login',
                templateUrl: 'templates/loginTemplate.html',
                controller: 'loginController'
            })
            .state('report', {
                url: '/event/:hackathonId/report',
                templateUrl: 'templates/reportBedsheetTemplate.html',
                controller: 'reportController'
            })
            .state('landingSelected', {
                url: '/event/:hackathonId/landing',
                templateUrl: 'templates/landingpage.html',
                controller: 'landingController'
            })
            .state('live', {
                url: '/event/:hackathonId/live',
                templateUrl: 'templates/bedsheetLive.html'
            });
    }

}());
