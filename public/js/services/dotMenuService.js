(function() {
    angular
        .module('app')
        .factory('dotMenuService', [
        '$location', '$rootScope', '$stateParams', 'roleService',
        function($location, $rootScope, $stateParams, roleService) {

            var dotMenuService = {};

            dotMenuService.panelOptions = function() {
                var url = $location.path();
                var currentUrl = url.split("/");
                var hackathonID = parseInt($stateParams.hackathonId);
                var roles = [];
                if (!isNaN(hackathonID)) {
                    if ($rootScope.globals.roles[hackathonID]) {
                        roles = Object.keys($rootScope.globals.roles[hackathonID]);
                    }
                }
                if($rootScope.globals.roles){
                    if ($rootScope.globals.roles.null !== undefined && $rootScope.globals.roles.null.ADMIN === true) {
                        roles.push('ADMIN');
                    }
                }
                return roles;

            };
            return dotMenuService;
        }]);
})();
