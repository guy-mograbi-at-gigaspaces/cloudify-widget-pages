'use strict';

angular.module('ibmBiginsightsUiApp')
    .directive('widgetRawOutputDisplay', function () {
        return {
            templateUrl: 'views/directives/_widgetOutputDisplay.html',
            restrict: 'A',
            scope: {
                'source': '=widgetRawOutputDisplay'
            },
            link: function postLink(/*scope, element, attrs*/) {
            }
        };
    });
