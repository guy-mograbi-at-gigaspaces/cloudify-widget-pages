'use strict';

angular.module('ibmBiginsightsUiApp')
    .controller('BluCtrl', function ($scope, I18next, $routeParams) {

        function setLanguage( code ){
            I18next.setOptions({lng: code});
        }

        $scope.toChinese =function(){
            setLanguage('ch');
        };

        $scope.toEnglish = function(){
            setLanguage('en');
        };


        setLanguage($routeParams.lang || 'ch');
    });
