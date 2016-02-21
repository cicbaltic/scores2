describe("test if test works", function() {
  it ("should be true", function (){
    var exp = 5;
    expect(exp).toBe(5);
  });
});

describe("authenticationService factory", function() {

  var authenticationService;

  beforeEach (function() {
    module('app');
    inject (function($injector) {
      authenticationService = $injector.get('authenticationService');
    });
  });
  it('should have an login function', function () {
    expect(angular.isFunction(authenticationService.login)).toBe(true);
  });

  // it('should have login with user:t@t, pass:t', function () {
  //   var successfulLogin = false;
  //   authenticationService.login('t@t','t', function (response) {
  //     // if(response) successfulLogin = response.success;
  //     // else successfulLogin = false;
  //     successfulLogin = true;
  //   });
  //   expect(successfulLogin).toBe(true);
  // });
});
