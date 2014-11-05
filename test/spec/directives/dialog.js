'use strict';

describe('Directive: dialog', function () {

    // load the directive's module
    beforeEach(module('ibmBiginsightsUiApp','directives-templates'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should put modal-open class on body when it is open', inject(function ($compile) {
        scope.show = false;
        element = angular.element('<div dialog show="show"></div>');
        element = $compile(element)(scope);
        scope.$digest();

        expect($('body').hasClass('modal-open')).toBe(false);

        scope.show=true;
        scope.$digest();

        expect($('body').hasClass('modal-open')).toBe(true);
    }));
});
