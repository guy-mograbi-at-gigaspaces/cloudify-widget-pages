'use strict';

describe('Directive: possibleErrors', function () {

  // load the directive's module
  beforeEach(module('ibmBiginsightsUiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<possible-errors></possible-errors>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the possibleErrors directive');
  }));
});
