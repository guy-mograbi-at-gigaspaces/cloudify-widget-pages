/**
 * Created by sefi on 15/02/15.
 */
'use strict';

angular.module('cloudifyWidgetPagesApp')
    .service('RandomValueGenerator', function () {
        var pattern = /[a-zA-Z0-9]/;

        var getRandomByte = function () {
            var result;

            if (window.crypto && window.crypto.getRandomValues) {
                result = new Uint8Array(1);
                window.crypto.getRandomValues(result);
                return result[0];
            }
            else if (window.msCrypto && window.msCrypto.getRandomValues) {
                result = new Uint8Array(1);
                window.msCrypto.getRandomValues(result);
                return result[0];
            }
            else {
                return Math.floor(Math.random() * 256);
            }
        };

        var service = {
            generate: function (length) {
                return Array.apply(null, {'length': length})
                    .map(function () {
                        var result;
                        while (true) {
                            result = String.fromCharCode(getRandomByte());
                            if (pattern.test(result)) {
                                return result;
                            }
                        }
                    }, this)
                    .join('');
            }
        };

        return service;
    })
;
