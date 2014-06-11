'use strict';

describe('Service: DisksService', function () {

  // load the service's module
  beforeEach(module('ibmBiginsightsUiApp'));

  // instantiate service
  var DisksService;
  beforeEach(inject(function (_DisksService_) {
    DisksService = _DisksService_;
  }));

  it('should do something', function () {
    expect(!!DisksService).toBe(true);
  });

});
