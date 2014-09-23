'use strict';

describe('Service: DataCenterService', function () {

    // load the service's module
    beforeEach(module('ibmBiginsightsUiApp'));

    // instantiate service
    var mDataCenterService;
    beforeEach(inject(function (DataCenterService) {
        mDataCenterService = DataCenterService;
    }));

    it('should do something', function () {
        expect(!!mDataCenterService).toBe(true);
    });

});
