'use strict';

angular.module('ibmBiginsightsUiApp')
    .directive('possibleErrors', function () {
        return {
            templateUrl: 'views/directives/_possibleErrors.html',
            restrict: 'A',
            scope: {
                'data': '=possibleErrors'
            },
            link: function postLink(scope/*, element, attrs*/) {

                scope.shouldShowTitle = function(){
                    // find item that has an error.if one exists, show title
                    var itemWithError = _.find(scope.data, function (item) {
                        if (!!item.error) {
                            return item;
                        }
                    });
                    return itemWithError !== null;
                }

            }
        };
    });
