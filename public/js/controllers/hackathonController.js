/*jshint browser: true, es5:true*/
/*jshint latedef: nofunc*/
/*global angular */

app.controller('hackathonController', ['$scope', '$stateParams', '$state',
'hackathonInfo', function($scope, $stateParams, $state, hackathonInfo) {
    var id;

    if ($stateParams.hackathonId === undefined) {
        id = 1;
    } else {
        id = $stateParams.hackathonId;
    }

    hackathonInfo.getHackathon(id).success(function(data) {
        $scope.info = data;
    });

}]);
