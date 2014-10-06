'use strict';

describe('Service: CloudDataService', function () {

    // load the service's module
    beforeEach(module('ibmBiginsightsUiApp'));

    // instantiate service
    var mCloudDataService;
    beforeEach(inject(function (CloudDataService) {
        mCloudDataService = CloudDataService;
    }));

    it('should do something', function () {
        expect(!!mCloudDataService).toBe(true);
    });

});
