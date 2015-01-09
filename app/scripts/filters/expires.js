'use strict';

/**
 * @ngdoc filter
 * @name cloudifyWidgetPagesApp.filter:expires
 * @function
 * @description
 * # expires
 * Filter in the cloudifyWidgetPagesApp.
 */
angular.module('cloudifyWidgetPagesApp')
    .filter('expires', function () {


        function padding(number) {

            var numberLength = (number + '').length;
            return '00'.substring(numberLength) + number;
        }

        return function (millis) {
//        millis = 601157;
//        $log.info(millis);
            if (typeof(millis) !== 'number') {
                millis = parseInt(millis, 10);
            }

            if (isNaN(millis)) {
                return '';
            }
            millis = Math.max(millis - new Date().getTime(),0);

            return padding(Math.floor(millis / 60000));
        };

    });
