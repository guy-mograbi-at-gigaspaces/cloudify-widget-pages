'use strict';

describe('Directive: widgetIframe', function () {

    // load the directive's module
    beforeEach(module('ibmBiginsightsUiApp'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
        element = angular.element('<div widget-iframe></div>');
        element = $compile(element)(scope);
        expect(element.text()).toBe('this is the widgetIframe directive');
    }));
});
