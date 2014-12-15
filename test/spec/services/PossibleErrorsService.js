'use strict';

describe('Service: PossibleErrorsService', function () {

    // load the service's module
    beforeEach(module('ibmBiginsightsUiApp'));

    // instantiate service
    var mPossibleErrorsService;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (PossibleErrorsService) {
        mPossibleErrorsService = PossibleErrorsService;
    }));

    it('should do something', function () {
        expect(!!mPossibleErrorsService).toBe(true);
    });

});
