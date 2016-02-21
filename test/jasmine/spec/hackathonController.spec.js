
describe('hackathonController tests', function() {
    beforeEach(angular.mock.module('app'));
    describe('hackathonController', function() {
        var scope, ctrl, $httpBackend;
        beforeEach(angular.mock.inject(function($rootScope, $controller, _$httpBackend_) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('/api/hackathon/info/1').
            respond({
                hackathonID: 1,
                hackathonName: "hackthon 1",
                image: "https://sites.dartmouth.edu/gsc/files/2014/04/Hackathon-logo.jpg",
                hackathonDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            });
            // $httpBackend.expectGET('templates/bedsheet.html').respond();
            scope = $rootScope.$new();
            ctrl = $controller('hackathonController', {
                $scope: scope
            });
        }));

        it('should have four properties', function() {
            $httpBackend.flush();
            expect(Object.keys(scope.info)).toEqual([
                "hackathonID", "hackathonName", "image", "hackathonDesc"
            ]);
        });
    });
});
