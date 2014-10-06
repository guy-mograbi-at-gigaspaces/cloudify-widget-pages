'use strict';

angular.module('ibmBiginsightsUiApp')
    .directive('recipePropertiesDisplay', function ( ) {
        return {
            templateUrl: 'views/directives/_recipePropertiesDisplay.html',
            restrict: 'A',
            'scope': {
                'properties': '=recipePropertiesDisplay'
            },
            link: function postLink(scope/*, element, attrs*/) {
                console.log('in iframe',window === window.parent);
                scope.showProperties = function(){ return  window === window.parent; };
            }
        };
    });
