'use strict';

describe('Service: SoftlayerPackageItemsService', function () {

    // load the service's module
    beforeEach(module('cloudifyWidgetPagesApp'));

    // instantiate service
    var mSoftlayerPackageItemsService;
    beforeEach(inject(function (SoftlayerPackageItemsService) {
        mSoftlayerPackageItemsService = SoftlayerPackageItemsService;
    }));

    it('should do something', function () {
        expect(!!mSoftlayerPackageItemsService).toBe(true);
    });

});
