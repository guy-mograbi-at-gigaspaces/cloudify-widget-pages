'use strict';

angular.module('cloudifyWidgetPagesApp')
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

                var handleStateChange = function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $log.info('status changed', newValue);
                        scope.page.stopping = false;
                    }
                };

                scope.$watch('source.widgetStatus.state', function (newValue, oldValue) {
                    handleStateChange(newValue, oldValue);
                });

                scope.$watch('source.widgetStatus.rawOutput', function () {
                    if (!!scope.source && !!scope.source.widgetStatus && !!scope.source.widgetStatus.rawOutput) {
                        scope.digestedOutput = OutputFilterService.filter(scope.source.widgetStatus.rawOutput);
                    }
                }, true);

                scope.$watch('source.widgetStatus.nodeModel.state', function (newValue, oldValue) {
                    handleStateChange(newValue, oldValue);
                });

                scope.$watch('source.widgetStatus.output', function () {
                    if (!!scope.source && !!scope.source.widgetStatus && !!scope.source.widgetStatus.output) {
                        scope.digestedOutput = OutputFilterService.filter(scope.source.widgetStatus.output);
                    }
                }, true);
            }
        };
    });
