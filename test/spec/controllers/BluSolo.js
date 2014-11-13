'use strict';

describe('Controller: BluSoloCtrl', function () {

    // load the controller's module
    beforeEach(module('ibmBiginsightsUiApp'));

    var BluSoloCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        BluSoloCtrl = $controller('BluSoloCtrl', {
            $scope: scope
        });
    }));

    it('should have function submitForm', function () {
        for ( var i in scope ){
            if ( i[0]  !== '$') {
                console.log('this is a field from submit form',i);
            }
        }
        expect(typeof(scope.submitForm)).toBe('function');
    });
});
