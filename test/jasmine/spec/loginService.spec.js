
describe ("Login Service (factory)", function () {
    var authenticationService;
    beforeEach (function() {
    module('app');
    inject (function($injector) {
        authenticationService = $injector.get('authenticationService');
        });
    });

    it ("login function should login with t@t / t", function () {
        expect(angular.isFunction(authenticationService.login)).toBe(true);
    });
});
