'use strict';

describe('Directive: helpPopover', function () {
  beforeEach(module('ibmBiginsightsUiApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<help-popover></help-popover>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the helpPopover directive');
  }));
});
