'use strict';

angular.module('ibmBiginsightsUiApp')
    .directive('switchLanguage', function (I18next, $routeParams, $timeout, $location, $rootScope, $log) {
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

                    $timeout(function () {
                        I18next.setOptions(
                            {lng: newValue },
                            { fallbackLng: 'general'}
                        );
                        I18next.getPromise().then(function () {
                        }, function () {
                        }, function () {
                            $log.info('after i18n load. rendering');
                            $rootScope.$render();
                        });
                    }, 0);
//              $timeout(function(){I18next.setOptions({lng: newValue })}, 10);
//              $timeout(function(){I18next.setOptions({lng: newValue })}, 100);
//              $timeout(function(){I18next.setOptions({lng: newValue })}, 1000);

                });
            }
        };
    });
