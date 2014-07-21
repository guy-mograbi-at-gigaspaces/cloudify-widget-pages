'use strict';

describe('Controller: BluCtrl', function () {

  // load the controller's module
  beforeEach(module('ibmBiginsightsUiApp'));

  var BluCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BluCtrl = $controller('BluCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
