'use strict';

describe('Directive: controlError', function () {

    // load the directive's module
    beforeEach(module('ibmBiginsightsUiApp'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should put class has-error on element if error exists', inject(function ($compile) {
        scope.myError = false;
        element = angular.element('<div control-error="myError"></div>');
        element = $compile(element)(scope);
        scope.$digest();
        expect(element.hasClass('has-error')).toBe(false);

        scope.myError = true;
        scope.$digest();
        expect(element.hasClass('has-error')).toBe(true);


    }));
});
