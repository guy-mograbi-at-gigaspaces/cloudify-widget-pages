'use strict';

describe('Service: AwsInstanceTypeService', function () {

    // load the service's module
    beforeEach(module('cloudifyWidgetPagesApp'));

    // instantiate service
    var mAwsInstanceTypeService;
    beforeEach(inject(function (AwsInstanceTypeService) {
        mAwsInstanceTypeService = AwsInstanceTypeService;
    }));

    it('should do something', function () {
        expect(!!mAwsInstanceTypeService).toBe(true);
    });

});
