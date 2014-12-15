'use strict';

angular.module('ibmBiginsightsUiApp')
    .directive('widgetRawOutputDisplay', function ($log, OutputFilterService ) {
        return {
            templateUrl: 'views/directives/_widgetOutputDisplay.html',
            restrict: 'A',
            scope: {
                'source': '=widgetRawOutputDisplay',
                'stop': '&'
            },
            link: function postLink(scope/*, element, attrs*/) {
                scope.page = {};

                scope.callStop = function () {
                    scope.page.showSomethingIsWrong = false;
                    scope.page.stopping = true;
                    scope.stop();
                };

                scope.$watch('source.widgetStatus.state', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $log.info('status changed', newValue);
                        scope.page.stopping = false;
                    }

                });

                scope.$watch('source.widgetStatus.rawOutput', function () {
                    if (!!scope.source && !!scope.source.widgetStatus && !!scope.source.widgetStatus.rawOutput) {
                        scope.digestedOutput = OutputFilterService.filter(scope.source.widgetStatus.rawOutput);
                    }
                }, true);


            }
        };
    });
