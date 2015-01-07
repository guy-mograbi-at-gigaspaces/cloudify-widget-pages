'use strict';

angular.module('cloudifyWidgetPagesApp')
    .directive('autoResizeIframe', function () {
        return {
            template: '<div ng-transclude></div>',
            restrict: 'A',
            transclude: true,
            link: function postLink(scope, element/*, attrs*/) {
                function resize() {
                    var $iframe = $(element).find('iframe');
                    if ($iframe.length > 0) {
                        $iframe.height($iframe[0].contentWindow.document.body.scrollHeight);
                        setTimeout(resize, 200);
                    }
                }

                resize();
            }
        };
    });
