'use strict';

describe('Service: RamService', function () {

    // load the service's module
    beforeEach(module('ibmBiginsightsUiApp'));

    // instantiate service
    var mRamService;
    beforeEach(inject(function (RamService) {
        mRamService = RamService;
    }));

    it('should do something', function () {
        expect(!!mRamService).toBe(true);
    });

});
