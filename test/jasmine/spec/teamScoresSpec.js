describe('team score controller', function() {
    beforeEach(module ('app'));
    beforeEach(inject(function(_$controller_) {
        $controller = _$controller_;
    }));
    it ('$scope.rows should not be null', function() {
        var $scope = [];
        var controller = $controller('scoreTableController', {$scope: $scope});
        expect($scope.rows).not.toBe(null)
    });
});
