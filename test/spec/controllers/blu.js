'use strict';

describe('Controller: BluCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudifyWidgetPagesApp'));

    var BluCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        BluCtrl = $controller('BluCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        // this controller is currently empty. perhaps we should remove it.
    });
});
