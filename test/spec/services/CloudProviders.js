'use strict';

describe('Service: CloudProviders', function () {

    // load the service's module
    beforeEach(module('ibmBiginsightsUiApp'));

    // instantiate service
    var mCloudProviders;
    beforeEach(inject(function (CloudProviders) {
        mCloudProviders = CloudProviders;
    }));

    it('should do something', function () {
        expect(!!mCloudProviders).toBe(true);
    });

});
