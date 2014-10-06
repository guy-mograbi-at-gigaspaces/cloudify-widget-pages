'use strict';

angular.module('ibmBiginsightsUiApp')
    .controller('MainCtrl', function ($scope, $http, $routeParams/*, $log , $timeout */) {
        $http.get('/build.json').then(function(result){
            $scope.version = result.data;
        });

        $scope.lang = $routeParams.lang;
    });
