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
        for (var i in scope) {
            if (i[0] !== '$') {
                console.log('this is a field from submit form', i);
            }
        }
        expect(typeof(scope.submitForm)).toBe('function');
    });

    it('should call updateProperties', inject(function (RecipePropertiesService, $timeout) {
        var widgetModel = {};
        scope.genericWidgetModel = widgetModel;

        spyOn(RecipePropertiesService.bluSolo, 'toProperties').andReturn('this is properties');
        scope.execution = 'new execution';
        scope.execution = 'another execution';

//        $timeout.flush();
        waitsFor(function () {
            try {
                scope.$apply();
            } catch (e) {
            }
            try {
                $timeout.flush();
            } catch (e) {
            }
            return !!scope.sentProperties;
        });

        runs(function () {
            expect(RecipePropertiesService.bluSolo.toProperties).toHaveBeenCalled();
            expect(scope.sentProperties).toBe('this is properties');
            expect(widgetModel.recipeProperties).toBe('this is properties');
        });

    }));

    it('should submit form', inject(function (BluSoloFormValidator) {

        spyOn(scope, 'playWidget').andReturn();
        var validateSpy = spyOn(BluSoloFormValidator, 'validateForm').andReturn();
        scope.submitForm();
        expect(scope.playWidget).toHaveBeenCalled();
        expect(BluSoloFormValidator.validateForm).toHaveBeenCalledWith(scope);

        validateSpy.andReturn('this is form errors');
        scope.submitForm();
        expect(scope.formErrors).toBe('this is form errors');

    }));

    it('should change location on provider change', inject(function ($location, AppConstants, $timeout) {

        var searchInvoked = false;
        spyOn($location, 'search').andCallFake(function () {
            searchInvoked = true;
        });

        scope.genericWidgetModel = {};
        scope.awsLoginDetails = 'this is aws login details';
        scope.softlayerLoginDetails = 'this is softlayer login details';
        scope.execution = { 'cloudProvider': 'fake' };

        // make sure 'fake' is applied..
        var fakeIsSet = false;
        $timeout(function () {
            fakeIsSet = true;
        }, 0);
        waitsFor(function () {
            try {
                scope.$digest();
            } catch (e) {
            }
            try {
                $timeout.flush();
            } catch (e) {
            }
            return fakeIsSet;
        });

        // now lets change the value on the scope and make sure it is applied
        runs(function () {
            scope.execution.cloudProviders = AppConstants.CloudProviders.AWS;
        });

        waitsFor(function () {
            try {
                scope.$apply();
            } catch (e) {
            }
            return searchInvoked;
        });

        runs(function () {
            expect(scope.genericWidgetModel.advancedData).toBe('this is aws login details');
            scope.execution.cloudProvider = AppConstants.CloudProviders.Softlayer;
            searchInvoked = false;
        });

        waitsFor(function () {
            console.log('still waiting!');
            try{
                scope.$apply();
            }catch(e){}

            return searchInvoked;
        });

        runs(function(){
            expect(scope.genericWidgetModel.advancedData).toBe('this is softlayer login details');
        });
    }));

    it('should expose a function to get element', function(){

        expect( typeof(scope.genericWidgetModel.element) ).toBe( 'function' );

        var iframes = scope.genericWidgetModel.element();
        expect(iframes).toBe(undefined);
    });
});
