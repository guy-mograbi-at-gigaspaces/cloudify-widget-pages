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

    it('detect softlayerItems is on window and put it on scope', inject(function ( $timeout) {
        window.softlayerItems = 'this is softlayer items';
        waits(50);
        $timeout.flush();
        runs( function(){
            expect(scope.softlayerItems).toBe('this is softlayer items');
        })

    }));
});
