'use strict';

angular.module('ibmBiginsightsUiApp')
    .directive('controlFocus', function () {
        return {
            template: '<div ng-transclude></div>',
            restrict: 'A',
            transclude: true,
            link: function postLink(scope, element/*, attrs*/) {
                element.find('input,select').focus(function () {
                    element.addClass('focused');
                }).blur(function () {
                    element.removeClass('focused');
                });

                element.mouseenter(function () {
                    element.addClass('hovered');
                }).mouseleave(function () {
                    element.removeClass('hovered');
                });
            }
        };
    });
