
describe ('judge controller', function () {
    beforeEach(module ('app'));
    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));
    it ('$scope.people should not be null and $scope.title to be "Judges"', function () {
        var $scope = {};
        var controller = $controller('judgeController', { $scope: $scope });
        expect($scope.people).not.toBe(null),
        expect($scope.title).toBe("Judges")
    });
});
