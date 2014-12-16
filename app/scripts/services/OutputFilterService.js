'use strict';

angular.module('ibmBiginsightsUiApp')
    .service('OutputFilterService', function OutputFilterService($log) {
        var illegalPatterns = [
            'java.net.SocketTimeoutException: Read timed out',
            'an exception during authentication'
        ];


        // returns true iff pattern not found in illegalPatterns
        function isValidOutput(line) {
            var foundMatch = _.find(illegalPatterns, function (item) {
                return line.match(item);
            });
            return !foundMatch;
        }

        function isRealException(item){
            if ( item.indexOf('an exception during authentication') >= 0 ){
                return false;
            }

            if ( item.indexOf('java.net.SocketTimeoutException: Read timed out') >=0 ){
                return false;
            }

            if ( item.indexOf('Exception')>=0){
                return true;
            }
        }

        this.filter = function (output) {
            var hasException = false;
            var result = null;
            result = _.reject(output, function isAfterException(item) {
                try {

                    // we want to return all lines up to the exception (including the exception line.. )
                    if (!hasException) {
                        hasException = isRealException(item);
                        return !isValidOutput(item);
                    } else {
                        return hasException;
                    }

                } catch (e) {
                    $log.warn('while filtering exception from output', e);
                }
            });
            return result;
        };

    });
