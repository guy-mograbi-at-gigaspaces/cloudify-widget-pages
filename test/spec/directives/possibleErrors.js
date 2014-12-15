'use strict';

describe('Directive: possibleErrors', function () {

    // load the directive's module
    beforeEach(module('ibmBiginsightsUiApp'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    function compile() {
        inject(function ($compile) {
            element = angular.element('<div possible-errors="errors"></div>');
            element = $compile(element)(scope);

        });
    }

    it('should make hidden element visible', function () {
        compile();
//        expect(element.text()).toBe('this is the possibleErrors directive');
    });

    it('should not show title if no possible reasons', inject(function () {
        compile();
    }));
});
