'use strict';

describe('Controller: MainCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudifyWidgetPagesApp'));

    var MainCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        MainCtrl = $controller('MainCtrl', {
            $scope: scope
        });
    }));

    it('should show build number on welcome page', inject(function ($httpBackend) {
        $httpBackend.expectGET('/build.json').respond('this is build');
        $httpBackend.flush();
        waitsFor(function () {
            return scope.version === 'this is build';
        });

//    expect(scope.awesomeThings.length).toBe(3);
    }));
});
