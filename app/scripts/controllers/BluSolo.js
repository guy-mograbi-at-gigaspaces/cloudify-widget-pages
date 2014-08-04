'use strict';

angular.module('ibmBiginsightsUiApp')
  .controller('BluSoloCtrl', function ($scope) {

        $scope.cloudProviders = [
            {
                'label' : 'AWS',
                'id' : 'aws'
            },
            {
                'label' : 'Softlayer',
                'id' : 'softlayer'
            }
        ];

        $scope.execution = {
            'cloudProvider' : 'aws',
            'softlayerAccount' : ''
        }
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
