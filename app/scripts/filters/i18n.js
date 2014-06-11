'use strict';

angular.module('ibmBiginsightsUiApp')
    .filter('i18n', function ($http, $log, $rootScope) {
        var translations = null;

        $log.info('loading translations');
        $http.get('i18n/translations.json').then(function (result) {
            translations = result.data;
            $log.info('translations loaded', translations);
            $rootScope.translationsLodaed = true;
        });


        return function (input) {
            if (input === '') {
                return '???';
            }
            try {
                var args = input.split('.');
                if (!translations) {
                    return 'translations not loaded';
                }
                var result = translations;
                for (var i in args) {
                    var arg = args[i];
                    if (!result.hasOwnProperty(arg)) {
                        throw 'no such key';
                    }
                    result = result[arg];
                }

                return result;
            } catch (e) {
                $log.error('unable to translate [%s]', input, e);
                return '???' + input + '???';
            }
        };
    });
