'use strict';

angular.module('cloudifyWidgetPagesApp')
    .directive('ibmPage', function ( $log, $compile ) {
        return {
            templateUrl: 'views/directives/_ibmPage.html',
            restrict: 'AC',
            transclude:true,
            scope: {
                'name' : '@',
                'snippetLink' : '@',
                'wrapperLink' : '@'
            },
            link: function postLink(scope, element, attrs, dummy, transcludeFn ) {

                transcludeFn( scope, function(elem/*, innerScope*/){

                    var compiled = $compile(elem)(scope);
                    element.append(compiled);
                });

                scope.getFullUrl = function(){
                    return document.location.origin + '/index.html' + scope.snippetLink;
                };
            }
        };
    });
