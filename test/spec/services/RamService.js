'use strict';

describe('Service: RamService', function () {

  // load the service's module
  beforeEach(module('ibmBiginsightsUiApp'));

  // instantiate service
  var RamService;
  beforeEach(inject(function (_RamService_) {
    RamService = _RamService_;
  }));

  it('should do something', function () {
    expect(!!RamService).toBe(true);
  });

});
