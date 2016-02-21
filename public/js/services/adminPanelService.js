(function() {
    'use strict';
    angular
    .module('app')
    .factory('adminPanelService', [ '$http', function($http) {
        var adminPanel = {};
        adminPanel.getInfo = function(_requestParameters_) {
            return $http.post('./organisers', {
                requestParameters: _requestParameters_
            });
        };
        return adminPanel;
    }]);
})();
