'use strict';

describe('Controller: BlufreeCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudifyWidgetPagesApp'));

    var BlufreeCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        BlufreeCtrl = $controller('BlufreeCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});
