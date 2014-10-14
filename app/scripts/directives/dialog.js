'use strict';

angular.module('ibmBiginsightsUiApp')
    .directive('dialog', function (/*$compile*/) {
        return {
            templateUrl: 'views/directives/_dialog.html',
            restrict: 'A',
            transclude: true,
            scope:{
                'show' : '='
            },
            link: function postLink(scope/*, element, attrs, transcludeFn*/) {
                scope.$watch('show', function(newValue, oldValue){
                    if ( newValue !== oldValue  ) {

                        if ( !!newValue ){
                            $('body').addClass('modal-open');
                        }else{
                            $('body').removeClass('modal-open');
                        }

                    }
                });

            }
        };
    });
