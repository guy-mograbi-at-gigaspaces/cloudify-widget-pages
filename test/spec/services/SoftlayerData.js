'use strict';

describe('Service: SoftlayerData', function () {

    // load the service's module
    beforeEach(module('ibmBiginsightsUiApp'));

    // instantiate service
    var mSoftlayerData;
    beforeEach(inject(function (SoftlayerData) {
        mSoftlayerData = SoftlayerData;
    }));

    it('should do something', function () {
        expect(!!mSoftlayerData).toBe(true);
    });

});
