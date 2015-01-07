'use strict';

describe('Service: properties/BluSolo', function () {

    // load the service's module
    beforeEach(module('cloudifyWidgetPagesApp'));

    // instantiate service
    var mBluSoloProperties;
    beforeEach(inject(function (BluSoloProperties) {
        mBluSoloProperties = BluSoloProperties;
    }));

    it('should do something', function () {
        expect(!!mBluSoloProperties).toBe(true);
    });

});
