'use strict';

describe('Directive: controlFocus', function () {
  beforeEach(module('ibmBiginsightsUiApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<control-focus></control-focus>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the controlFocus directive');
  }));
});
