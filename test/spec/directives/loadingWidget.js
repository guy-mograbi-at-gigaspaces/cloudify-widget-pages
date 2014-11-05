'use strict';

describe('Directive: loadingWidget', function () {

    // load the directive's module
    beforeEach(module('ibmBiginsightsUiApp','directives-templates'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should display as long as widget is not loaded', inject(function ($compile) {
        scope.myWidget = {
                loaded : false
        };
        element = angular.element('<div loading-widget="myWidget"></div>');
        element = $compile(element)(scope);
        scope.$digest();
        expect(element.children().hasClass('ng-hide')).toBe(false);

        scope.myWidget.loaded = true;
        scope.$digest();
        expect(element.children().hasClass('ng-show')).toBe(false);
        expect(element.children().hasClass('ng-hide')).toBe(true);
    }));
});
