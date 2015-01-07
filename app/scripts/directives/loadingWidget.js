'use strict';

angular.module('cloudifyWidgetPagesApp')
    .directive('loadingWidget', function () {
        return {
            templateUrl: 'views/directives/_loadingWidget.html',
            restrict: 'A',
            scope: {
                'genericWidgetModel': '=loadingWidget'
            },
            link: function postLink(/*scope, element, attrs*/) {
            }
        };
    });
