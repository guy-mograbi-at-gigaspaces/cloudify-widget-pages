'use strict';

describe('Service: AwsRegionService', function () {

    // load the service's module
    beforeEach(module('cloudifyWidgetPagesApp'));

    // instantiate service
    var mAwsRegionService;
    beforeEach(inject(function (AwsRegionService) {
        mAwsRegionService = AwsRegionService;
    }));

    it('should do something', function () {
        expect(!!mAwsRegionService).toBe(true);
    });

});
