'use strict';

describe('Directive: widgetRawOutputDisplay', function () {

    // load the directive's module
    beforeEach(module('ibmBiginsightsUiApp'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($rootScope, $compile) {
        scope.guy = 'this is the widgetRawOutputDisplay directive';
        element = angular.element('<div widget-raw-output-display="guy"></div>');
        element = $compile(element)(scope);
        $rootScope.$digest();
        expect(element.text()).toBe('this is the widgetRawOutputDisplay directive');
    }));
});
