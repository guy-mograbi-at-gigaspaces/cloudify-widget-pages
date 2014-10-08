'use strict';

describe('Service: BluSoloFormValidator', function () {

    // load the service's module
    beforeEach(module('ibmBiginsightsUiApp'));

    // instantiate service
    var mBluSoloFormValidator;
    beforeEach(inject(function (BluSoloFormValidator) {
        mBluSoloFormValidator = BluSoloFormValidator;
    }));

    it('should do something', function () {
        expect(!!mBluSoloFormValidator).toBe(true);
    });

});
