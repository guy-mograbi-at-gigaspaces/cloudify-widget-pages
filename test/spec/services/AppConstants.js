'use strict';

describe('Service: CloudProviders', function () {

    // load the service's module
    beforeEach(module('ibmBiginsightsUiApp'));

    // instantiate service
    var mAppConstants;
    beforeEach(inject(function (AppConstants) {
        mAppConstants = AppConstants;
    }));

    it('should do something', function () {
        expect(!!mAppConstants).toBe(true);
    });

});
