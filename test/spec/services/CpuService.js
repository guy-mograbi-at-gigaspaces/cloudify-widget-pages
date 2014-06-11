'use strict';

describe('Service: CpuService', function () {

  // load the service's module
  beforeEach(module('ibmBiginsightsUiApp'));

  // instantiate service
  var CpuService;
  beforeEach(inject(function (_CpuService_) {
    CpuService = _CpuService_;
  }));

  it('should do something', function () {
    expect(!!CpuService).toBe(true);
  });

});
