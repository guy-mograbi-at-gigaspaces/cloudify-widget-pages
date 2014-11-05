'use strict';

describe('Directive: widgetRawOutputDisplay', function () {

    // load the directive's module
    beforeEach(module('ibmBiginsightsUiApp','directives-templates'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should change put elements on page when calling stop', inject(function ($rootScope, $compile) {
        scope.guy = 'this is the widgetRawOutputDisplay directive';
        scope.source = {
            widgetStatus : { state : 'STOPPED' }
        };

        var stopInvoked = false;
        scope.onStop = function(){
            stopInvoked = true;
        };


        element = angular.element('<div widget-raw-output-display="source" stop="onStop()"></div>');
        element = $compile(element)(scope);
        $rootScope.$digest();
        var isolateScope = element.children().scope();
        expect(typeof(isolateScope.callStop)).toBe('function');
        expect(typeof(isolateScope.page)).toBe('object');

        isolateScope.callStop();
        $rootScope.$digest();

        expect(isolateScope.page.stopping).toBe(true);
        expect(isolateScope.page.showSomethingIsWrong).toBe(false);
        expect(stopInvoked).toBe(true);

    }));

    it ('should set page.stopped false if status changes', inject(function( $compile, $rootScope ){
        scope.guy = 'this is the widgetRawOutputDisplay directive';
        scope.source = {
            widgetStatus : { state : 'STOPPED' }
        };

        var stopInvoked = false;
        scope.onStop = function(){
            stopInvoked = true;
        };


        element = angular.element('<div widget-raw-output-display="source" ></div>');
        element = $compile(element)(scope);
        $rootScope.$digest();
        var isolateScope = element.children().scope();
        isolateScope.page.stopping = true;
        $rootScope.$digest();

        scope.source.widgetStatus.state = 'GUY';
        $rootScope.$digest();
        expect(isolateScope.page.stopping).toBe(false);
    }));
});
