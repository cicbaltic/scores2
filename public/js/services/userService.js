(function() {
    /*jshint browser:true, es5:true*/
    'use strict';
    angular
        .module('app')
        .factory ('userService', userService);

    userService.$inject = ['$http'];

    function userService($http) {
        function updateUserInfo(payload) {
            return $http.post('./api/user/info', payload);
        }

        function registerNewUser(payload) {
            return $http.post('./api/user/register', payload);
        }

        return {
            updateUserInfo: updateUserInfo,
            registerNewUser: registerNewUser
        };
    }
})();
