'use strict';

describe('Directive: controlFocus', function () {
    beforeEach(module('cloudifyWidgetPagesApp'));

    var element;

    function setup() {
        inject(function ($rootScope, $compile) {
            element = angular.element('<div control-focus><input/></div>');
            element = $compile(element)($rootScope);
            $('body').append(element);
            $rootScope.$digest();
        });

    }

    it('should have class hovered when mouse enters', function () {
        setup();

        element.trigger('mouseenter');

        expect(element.is('.hovered')).toBe(true);
    });

    it('should have class focused when input/select is focused', inject(function (/*$log, $timeout*/) {
        setup();

        // todo this test.
        // try to use : http://stackoverflow.com/questions/24196072/how-to-test-focus-in-angularjs
        // to work
//        console.log('we have input and select',element.find('input,select').length);
//
////        element.find('input,select').focus();
//
//        $(document.body).append(element);
//         debugger;
//        waitsFor( function(){
//            console.log(element.find('input,select').is(':visible'));
//            $timeout(function(){
//                element.find('input,select').focus();
//            }, 100);
//
//            $timeout.flush();
//
//            return element.is('.focused');
//        });
//        element.remove();


    }));
});
