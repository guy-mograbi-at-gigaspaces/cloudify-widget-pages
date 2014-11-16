'use strict';

describe('Service: PossibleErrorsService', function () {

    // load the service's module
    beforeEach(module('ibmBiginsightsUiApp'));

    // instantiate service
    var scope;
    var PossibleErrorsService;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        PossibleErrorsService = $controller('PossibleErrorsService', {
            $scope: scope
        });
    }));

    it('should do something', function () {
        expect(!!PossibleErrorsService).toBe(true);
    });

});
