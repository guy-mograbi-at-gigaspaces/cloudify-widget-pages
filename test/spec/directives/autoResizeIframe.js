'use strict';

describe('Directive: autoResizeIframe', function () {
  beforeEach(module('ibmBiginsightsUiApp'));

  var element;

  it('should transclude content', inject(function ($rootScope, $compile) {
    element = angular.element('<div auto-resize-iframe>this is the autoResizeIframe directive</div>');
    element = $compile(element)($rootScope);
      $rootScope.$digest();
    expect(element.text()).toBe('this is the autoResizeIframe directive');
  }));
});
