'use strict';

describe('Directive: widgetIframe', function () {

    // load the directive's module
    beforeEach(module('ibmBiginsightsUiApp'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    // this resolves issue where 'postMessage' and 'receiveMessage' don't connect to the new iframe
    it('should remove iframe from page and assign a new one on url change', inject(function ($compile) {
        scope.myUrl = 'http://www.google.com';
        element = angular.element('<div widget-iframe url="myUrl"></div>');
        element = $compile(element)(scope);
        scope.$digest();
        element.find('iframe').attr('guy','mograbi');
        expect(element.find('iframe').attr('guy')).toBe('mograbi');

        scope.myUrl = 'http://bing.com';
        scope.$digest();
        expect(element.find('iframe').attr('guy')).toBe(undefined);
    }));
});
