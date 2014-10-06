'use strict';

describe('Service: AwsData', function () {

    // load the service's module
    beforeEach(module('ibmBiginsightsUiApp'));

    // instantiate service
    var mAwsData;
    beforeEach(inject(function (AwsData) {
        mAwsData = AwsData;
    }));

    it('should do something', function () {
        expect(!!mAwsData).toBe(true);
    });

});
