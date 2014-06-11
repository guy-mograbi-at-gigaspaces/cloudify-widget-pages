'use strict';

describe('Service: DataCenterService', function () {

  // load the service's module
  beforeEach(module('ibmBiginsightsUiApp'));

  // instantiate service
  var DataCenterService;
  beforeEach(inject(function (_DataCenterService_) {
    DataCenterService = _DataCenterService_;
  }));

  it('should do something', function () {
    expect(!!DataCenterService).toBe(true);
  });

});
