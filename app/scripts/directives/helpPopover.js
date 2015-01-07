'use strict';

angular.module('cloudifyWidgetPagesApp')
    .directive('helpPopover', function ($log, $filter) {
        return {
            templateUrl: '/views/directives/helpPopover.html',
            restrict: 'A',
            replace: true,

            link: function postLink(scope, element, attrs) {
                var i18n = $filter('i18n');
                var text = i18n(attrs.content || attrs.helpPopover);


                $(element).popover({ 'content': text, 'trigger': 'hover', 'style': {'width': '400px'}}).data('popover');


//        element.text('this is the helpPopover directive');
            }
        };
    });
