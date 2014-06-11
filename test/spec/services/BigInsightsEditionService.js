'use strict';

describe('Service: BigInsightsEditionService', function () {

  // load the service's module
  beforeEach(module('ibmBiginsightsUiApp'));

  // instantiate service
  var BigInsightsEditionService;
  beforeEach(inject(function (_BigInsightsEditionService_) {
    BigInsightsEditionService = _BigInsightsEditionService_;
  }));

  it('should do something', function () {
    expect(!!BigInsightsEditionService).toBe(true);
  });

});
