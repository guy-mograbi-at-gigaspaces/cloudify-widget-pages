'use strict';

describe('Service: BigInsightsEditionService', function () {

    // load the service's module
    beforeEach(module('cloudifyWidgetPagesApp'));

    // instantiate service
    var mBigInsightsEditionService;
    beforeEach(inject(function (BigInsightsEditionService) {
        mBigInsightsEditionService = BigInsightsEditionService;
    }));

    it('should do something', function () {
        expect(!!mBigInsightsEditionService).toBe(true);
    });

});
