'use strict';

angular.module('ibmBiginsightsUiApp')
    .controller('MainCtrl', function ($scope, $http ) {
        $http.get('/build.json').then(function(result){
            $scope.version = result.data;
        });
    });
