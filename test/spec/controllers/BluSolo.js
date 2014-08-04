'use strict';

describe('Controller: BluSoloCtrl', function () {

  // load the controller's module
  beforeEach(module('ibmBiginsightsUiApp'));

  var BluSoloCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BluSoloCtrl = $controller('BluSoloCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
