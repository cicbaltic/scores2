describe ('organizer controller', function () {
    beforeEach(module ('app'));
    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));
    it ('$scope.people should not be null and $scope.title to be "Oraganizers"', function () {
        var $scope = {};
        var controller = $controller('organisersController', { $scope: $scope });
        expect($scope.people).not.toBe(null),
        expect($scope.title).toBe("Organisers")
    });
});
