(function() {
    'use strict';
    angular
        .module('app')
        .factory ('reportService', ['$http',
            function($http) {
                var reportService = {};

                reportService.getData = function(payload, callback) {
                    $http.get('./api/reportService/' + payload.id)
                    .then(function(result) {
                        callback(result);
                    },
                    function(err) {
                        callback(err);
                    });
                };

                return reportService
            }]);
})();
