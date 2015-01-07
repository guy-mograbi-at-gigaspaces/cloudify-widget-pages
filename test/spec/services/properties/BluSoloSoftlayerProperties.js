'use strict';

describe('Service: BluSoloSoftlayerProperties', function () {

    // load the service's module
    beforeEach(module('cloudifyWidgetPagesApp'));

    // instantiate service
    var mBluSoloSoftlayerProperties;
    beforeEach(inject(function (BluSoloSoftlayerProperties) {
        mBluSoloSoftlayerProperties = BluSoloSoftlayerProperties;
    }));

    it('should do something', function () {
        expect(!!mBluSoloSoftlayerProperties).toBe(true);
    });

});
