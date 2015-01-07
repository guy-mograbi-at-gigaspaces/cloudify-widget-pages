'use strict';

describe('Service: CpuService', function () {

    // load the service's module
    beforeEach(module('cloudifyWidgetPagesApp'));

    // instantiate service
    var mCpuService;
    beforeEach(inject(function (CpuService) {
        mCpuService = CpuService;
    }));

    it('should do something', function () {
        expect(!!mCpuService).toBe(true);
    });

});
