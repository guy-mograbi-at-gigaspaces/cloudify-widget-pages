'use strict';

describe('Directive: ibmPage', function () {
    beforeEach(module('ibmBiginsightsUiApp','directives-templates'));

    var element;

    it('should assign getFullUrl to the scope', inject(function ($rootScope, $compile) {
        element = angular.element('<div ibm-page></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(typeof(element.children().scope().getFullUrl)).toBe('function');
    }));
});
