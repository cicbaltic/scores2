(function() {
    'use strict';
    angular
        .module('app')
        .controller('dotMenuCloseController', ['$scope', '$rootScope',
        function($scope, $rootScope) {
            $scope.dmcc = {};
            $scope.dmcc.enableDotMenuCloser = false;
            $scope.dmcc.dotMenuClose = function() {
                $rootScope.$emit('dotMenuCloseControllerClicked'); //emit to headerController
            };
            $rootScope.$on('dotMenuCloseControllerDisable', function() { //receive from headerController
                $scope.dmcc.enableDotMenuCloser = false;
            });
            $rootScope.$on('dotMenuCloseControllerEnable', function() { //receive from headerController
                $scope.dmcc.enableDotMenuCloser = true;
            });
        }]);
})();
