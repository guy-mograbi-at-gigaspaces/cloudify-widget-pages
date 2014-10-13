'use strict';

angular.module('ibmBiginsightsUiApp')
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
