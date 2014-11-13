'use strict';

angular.module('ibmBiginsightsUiApp')
    .directive('widgetRawOutputDisplay', function ($log) {
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
                        var hasException = false;
                        scope.digestedOutput = _.reject(scope.source.widgetStatus.rawOutput, function isAfterException(item) {
                            try {

                                // we want to return all lines up to the exception (including the exception line.. )
                                if (!hasException) {
                                    hasException = item.indexOf('Exception') >= 0;
                                    return false;
                                } else {
                                    return hasException;
                                }

                            } catch (e) {
                                $log.warn('while filtering exception from output', e);
                            }
                        });
                    }
                }, true);


            }
        };
    });
