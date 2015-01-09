'use strict';

describe('Controller: BlufreeCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudifyWidgetPagesApp'));
    beforeEach(module(function ($controllerProvider) {
        $controllerProvider.register('GsGenericCtrl', function( $scope ){
            $scope.genericWidgetModel = {};
        });
    }));

    var BlufreeCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope ) {
        scope = $rootScope.$new();
        //$provide.provider('GsGenericCtrl',function(){});
        BlufreeCtrl = $controller('BluFreeCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});
