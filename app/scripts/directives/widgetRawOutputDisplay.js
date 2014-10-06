'use strict';

angular.module('ibmBiginsightsUiApp')
    .directive('widgetRawOutputDisplay', function () {
        return {
            template: '<div><pre>BLU Installation started. Please wait, this might take a while\n' +
                '{{source}}</pre></div>',
            restrict: 'A',
            scope: {
                'source': '=widgetRawOutputDisplay'
            },
            link: function postLink(/*scope, element, attrs*/) {
            }
        };
    });
