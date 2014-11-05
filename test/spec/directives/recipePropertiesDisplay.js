'use strict';

describe('Directive: recipePropertiesDisplay', function () {
    beforeEach(module('ibmBiginsightsUiApp', 'directives-templates'));

    var element;

    it('should make hidden element visible', inject(function ($rootScope, $compile) {
        element = angular.element('<div recipe-properties-display></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(element.find('table').length).toBe(1);
    }));
});
