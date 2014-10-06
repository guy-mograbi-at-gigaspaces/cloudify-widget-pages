'use strict';

describe('Controller: SoftlayerPackageItemsCtrl', function () {

    // load the controller's module
    beforeEach(module('ibmBiginsightsUiApp'));

    var SoftlayerPackageItemsCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        SoftlayerPackageItemsCtrl = $controller('SoftlayerPackageItemsCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});
