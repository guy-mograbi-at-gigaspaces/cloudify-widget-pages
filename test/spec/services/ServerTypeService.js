'use strict';

describe('Service: ServerTypeService', function () {

  // load the service's module
  beforeEach(module('ibmBiginsightsUiApp'));

  // instantiate service
  var ServerTypeService;
  beforeEach(inject(function (_ServerTypeService_) {
    ServerTypeService = _ServerTypeService_;
  }));

  it('should do something', function () {
    expect(!!ServerTypeService).toBe(true);
  });

});
