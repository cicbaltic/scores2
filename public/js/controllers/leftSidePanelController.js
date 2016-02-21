(function() {
    'use strict';
    angular
        .module('app')
        .controller('leftSidePanelController', ['$scope', '$location', '$anchorScroll',
        'pageRedirectService',
        function($scope, $location, $anchorScroll, pageRedirectService) {
            $scope.lspc = {};
            var selectedItemToClear = '';
            $scope.lspc.jumpTo = function(elementID, redirect) {
                if (!redirect) {
                    $location.path('event/' + parseInt(($location.path()).split("/")[2]));
                    $location.hash(elementID);
                    $anchorScroll();
                } else {
                    redirector(elementID);
                }
                selection(elementID);
            };
            function redirector(redirectLocation) {
                pageRedirectService.redirect(redirectLocation);
            }
            function selection(elementID) {
                //keep item selected
                $scope.lspc[selectedItemToClear] = '';
                $scope.lspc[elementID] = 'selectedItem';
                selectedItemToClear = elementID;
            }
        }]);
})();
