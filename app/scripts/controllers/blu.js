'use strict';

angular.module('ibmBiginsightsUiApp')
    .controller('BluCtrl', function ($scope, I18next, $routeParams, $timeout) {

        function setLanguage( code ){
            I18next.setOptions({lng: code});
        }

        $scope.toChinese =function(){
            $timeout(function(){ setLanguage('ch')},0);
        };

        $scope.toEnglish = function(){
            setLanguage('en');
        };


        setLanguage($routeParams.lang || 'ch');
    });
