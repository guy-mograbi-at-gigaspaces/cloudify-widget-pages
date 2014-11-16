'use strict';

angular.module('ibmBiginsightsUiApp')
    .directive('possibleErrors', function () {
        return {
            templateUrl: 'views/directives/_possibleErrors.html',
            restrict: 'A',
            scope: {
                'data': '=possibleErrors'
            },
            link: function postLink(/*scope, element, attrs*/) {

            }
        };
    });
