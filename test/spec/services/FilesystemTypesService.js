'use strict';

describe('Service: FilesystemTypesService', function () {

  // load the service's module
  beforeEach(module('ibmBiginsightsUiApp'));

  // instantiate service
  var FilesystemTypesService;
  beforeEach(inject(function (_FilesystemTypesService_) {
    FilesystemTypesService = _FilesystemTypesService_;
  }));

  it('should do something', function () {
    expect(!!FilesystemTypesService).toBe(true);
  });

});
