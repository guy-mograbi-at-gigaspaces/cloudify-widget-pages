'use strict';

angular.module('cloudifyWidgetPagesApp')
    .directive('controlError', function () {
        return {
            restrict: 'A',
            scope: {
                'flag': '=controlError'
            },
            link: function postLink(scope, element/*, attrs*/) {
                scope.$watch('flag', function () {
                    if (!!scope.flag) {
                        element.addClass('has-error');
                    } else {
                        element.removeClass('has-error');
                    }
                });
            }
        };
    });
