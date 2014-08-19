'use strict';

angular.module('ibmBiginsightsUiApp')
  .controller('BluSoloCtrl', function ($scope, $log, DataCenterService) {


        var CloudProviders = {
            'AWS' : 'aws',
            'Softlayer' : 'softlayer'
        };
        $scope.cloudProviders = [
            {
                'label' : 'AWS',
                'id' : CloudProviders.AWS
            },
            {
                'label' : 'Softlayer',
                'id' : CloudProviders.Softlayer
            }
        ];

        $scope.regions = [
            {
                'id' : 'us-east-1',
                'ami' : 'blublu ami',
                'label' : 'US East 1'
            }
        ];

        $scope.instanceTypes = [
            {
                'id' : 'm3.2xlarge',
                'label' : 'm3.2xlarge'
            }
        ];

        DataCenterService.getDataCenters().then(function( result ){
            $scope.dataCenters = result;
        });

        $scope.execution = {
            'cloudProvider' : CloudProviders.AWS,
            'softlayerAccount' : '',
            'region' : 'us-east-1',
            'instanceType' : 'm3.2xlarge' ,
            'dataCenter' : DataCenterService.getDefaultValue()
        };

        $scope.formIsValid = false;

        function isAws(){
            return $scope.execution.cloudProvider ===  CloudProviders.AWS;
        }

        function isSoftlayer(){
            return $scope.execution.cloudProvider === CloudProviders.Softlayer;
        }

        function _error ( message ){
            $scope.execution.error = message;
        }


        function validateAws(){
             if ( !$scope.execution.awsAccount ){
                 $scope.execution.error = 'Account number is blank';
                 return;
             }

            if ( !$scope.execution.awsApiKey ){
                $scope.execution.error = 'AWS API Key is blank';
                return;
            }

            if ( !$scope.execution.awsApiSecretKey ){
                $scope.execution.error = 'AWS API Secret Key is missing';
            }
        }

        function validateSoftlayer(){

        }

        function validateCommon(){
            function validateEmail(email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }

            if ( !$scope.execution.email ){
                $scope.execution.error = 'Email is blank';
                return;
            }
            if ( !validateEmail($scope.execution.email)){
                $scope.execution.error = 'Email is invalid';
                return;
            }
        }


        $scope.$watch('execution', function(){

            $scope.execution.error = null;
            if ( isAws() ){
                validateAws();
            }

            else if ( isSoftlayer() ){
                validateSoftlayer();
            }

            $scope.formIsValid = !$scope.execution.error;

            if ( !!$scope.formIsValid ){
                validateCommon();
            }

            $scope.formIsValid = !$scope.execution.error;





        },true);

        $scope.submitForm = function(){
            $log.info('submitting form');
        };
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
