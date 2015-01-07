'use strict';

describe('Service: DisksService', function () {

    // load the service's module
    beforeEach(module('cloudifyWidgetPagesApp'));

    // instantiate service
    var mDisksService;
    beforeEach(inject(function (DisksService) {
        mDisksService = DisksService;
    }));

    it('should do something', function () {
        expect(!!mDisksService).toBe(true);
    });

});
