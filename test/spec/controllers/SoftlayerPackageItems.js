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
        });

    }));

    it('should load cached items from dropbox', inject(function($httpBackend){
        $httpBackend.expectGET('https://www.dropbox.com/s/if4akhffs2m4avb/data.json?dl=1').respond( 'this is data');
        scope.loadCachedItems();
        $httpBackend.flush();
        expect(scope.items).toBe('this is data');
    }));

    it('should load items', inject(function(SoftlayerPackageItemsService){
        spyOn(SoftlayerPackageItemsService,'getItems').andReturn();
        scope.loadItems();
        expect(SoftlayerPackageItemsService.getItems).toHaveBeenCalled();
    }));
});
