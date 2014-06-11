'use strict';

describe('Service: RecipePropertiesService', function () {

  // load the service's module
  beforeEach(module('ibmBiginsightsUiApp'));

  // instantiate service
  var RecipePropertiesService;
  beforeEach(inject(function (_RecipePropertiesService_) {
    RecipePropertiesService = _RecipePropertiesService_;
  }));

  it('should do something', function () {
    expect(!!RecipePropertiesService).toBe(true);
  });

});
