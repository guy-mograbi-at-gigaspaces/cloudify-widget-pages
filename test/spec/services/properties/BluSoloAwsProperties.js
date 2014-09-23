'use strict';

describe('Service: properties/BluSoloAws', function () {

    // load the service's module
    beforeEach(module('ibmBiginsightsUiApp'));

    // instantiate service
    var mBluSoloAwsProperties;
    beforeEach(inject(function (BluSoloAwsProperties) {
        mBluSoloAwsProperties = BluSoloAwsProperties;
    }));

    it('should do something', function () {
        expect(!!mBluSoloAwsProperties).toBe(true);
    });

});
