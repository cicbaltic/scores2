(function() {
    app.controller('landingController', ['$scope', 'pageRedirectService',
    'hackathonInfo', function($scope, pageRedirectService, hackathonInfo) {
        hackathonInfo.getAllHackathons().success(function(result) {
            $scope.hackathons = result;
        });

        $scope.redirect = function redirect(id) {
            pageRedirectService.redirect('home', id);
        };
    }]);
})();
