'use strict';

angular.module('ibmBiginsightsUiApp')
    .controller('BluCtrl', function ($scope, I18next) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        I18next.setOptions({lng: 'ch'});
    });
