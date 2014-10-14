'use strict';

angular.module('ibmBiginsightsUiApp')
    .directive('widgetRawOutputDisplay', function ( $log ) {
        return {
            templateUrl: 'views/directives/_widgetOutputDisplay.html',
            restrict: 'A',
            scope: {
                'source': '=widgetRawOutputDisplay',
                'stop' : '&'
            },
            link: function postLink(scope/*, element, attrs*/) {
                scope.page = {};

                scope.isRunning = function(){
                    scope.source.widgetStatus.state = 'RUNNING';
                };

                scope.callStop = function(){
                    scope.page.showSomethingIsWrong = false;
                    scope.page.stopping = true;
                    scope.stop();
                };

                scope.$watch('source.widgetStatus.state', function(newValue, oldValue){
                    if ( newValue !== oldValue ) {
                        $log.info('status changed', newValue);
                        scope.page.stopping = false;
                    }

                });

            }
        };
    });
