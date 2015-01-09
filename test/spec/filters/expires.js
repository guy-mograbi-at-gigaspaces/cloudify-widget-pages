'use strict';

describe('Filter: expires', function () {

    // load the filter's module
    beforeEach(module('cloudifyWidgetPagesApp'));

    // initialize a new instance of the filter before each test
    var expires;
    beforeEach(inject(function ($filter) {
        expires = $filter('expires');
    }));

    it('should return the input prefixed with "expires filter:"', function () {
        expect(expires(1000)).toBe('00');
    });

});
