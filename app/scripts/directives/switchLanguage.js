'use strict';

angular.module('ibmBiginsightsUiApp')
    .directive('switchLanguage', function (I18next, $routeParams, $timeout, $location, $log) {
        return {
            templateUrl: 'views/directives/switchLanguage.html',
            restrict: 'C',
            link: function postLink($scope/*, element, attrs*/) {
                function setLanguage(code) {
                    $location.search('lang', code);
                }

                $scope.toChinese = function () {
                    $timeout(function () {
                        setLanguage('ch');
                    }, 0);
                };

                $scope.toEnglish = function () {
                    setLanguage('en');
                };


                $scope.$watch(function () {

                    return $routeParams.lang;
                }, function (newValue) {
                    $log.info('setting lang', newValue);

                    I18next.setOptions(
                        {
                            lng: newValue,
                            resGetPath: 'i18n/__ns_____lng__.json?timestamp' + new Date().getTime(),
                            fallbackLng: 'general' //todo : make this an array
                        }
                    );


                });
            }
        };
    });
