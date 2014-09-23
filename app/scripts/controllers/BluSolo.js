'use strict';

angular.module('ibmBiginsightsUiApp')
    .controller('BluSoloCtrl', function ($scope, $log, DataCenterService, RecipePropertiesService) {

        $scope.widgetLoaded = false;


        var CloudProviders = {
            'AWS': 'aws',
            'Softlayer': 'softlayer'
        };
        $scope.cloudProviders = [
            {
                'label' : 'AWS',
                'id' : CloudProviders.AWS
            }//,
//            {
//                'label': 'Softlayer',
//                'id': CloudProviders.Softlayer
//            }
        ];

        $scope.regions = [
            {
                'id': 'us-east-1',
                'ami': 'blublu ami',
                'label': 'US East 1'
            }
        ];

        $scope.instanceTypes = [
            {
                'id': 'm3.2xlarge',
                'label': 'm3.2xlarge'
            }
        ];

        DataCenterService.getDataCenters().then(function (result) {

            $scope.dataCenters = result;
            $scope.execution.dataCenter = _.find(result, { 'label': 'hongkong2'}).id;
        });


        $scope.loginDetails = {};
        $scope.awsLoginDetails = {};
        $scope.execution = {
            'cloudProvider': CloudProviders.AWS,
            'softlayerAccount': '',
            'region': 'us-east-1',
            'instanceType': 'm3.2xlarge'

        };

        $scope.formIsValid = false;

//        function isAws(){
//            return $scope.execution.cloudProvider ===  CloudProviders.AWS;
//        }
//
//        function isSoftlayer(){
//            return $scope.execution.cloudProvider === CloudProviders.Softlayer;
//        }

//        function _error(message) {
//            $scope.execution.error = message;
//        }


//        function validateAws(){
//             if ( !$scope.execution.awsAccount ){
//                 $scope.execution.error = 'Account number is blank';
//                 return;
//             }
//
//            if ( !$scope.execution.awsApiKey ){
//                $scope.execution.error = 'AWS API Key is blank';
//                return;
//            }
//
//            if ( !$scope.execution.awsApiSecretKey ){
//                $scope.execution.error = 'AWS API Secret Key is missing';
//            }
//        }

//        function validateSoftlayer(){
//
//        }

//        function validateCommon(){
//            function validateEmail(email) {
//                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//                return re.test(email);
//            }
//
//            if ( !$scope.execution.email ){
//                $scope.execution.error = 'Email is blank';
//                return;
//            }
//            if ( !validateEmail($scope.execution.email)){
//                $scope.execution.error = 'Email is invalid';
//                return;
//            }
//        }


//        $scope.$watch('execution', function(){
//
//            $scope.execution.error = null;
//            if ( isAws() ){
//                validateAws();
//            }
//
//            else if ( isSoftlayer() ){
//                validateSoftlayer();
//            }
//
//            $scope.formIsValid = !$scope.execution.error;
//
//            if ( !!$scope.formIsValid ){
//                validateCommon();
//            }
//
//            $scope.formIsValid = !$scope.execution.error;
//
//        },true);

        function validateForm() {
//            if (!$scope.loginDetails.softlayerApiKey || !$scope.loginDetails.softlayerApiSecretKey || !$scope.execution.dataCenter) {
//                _error('Value is missing');
//                return false;
//            }
            return true;
        }


        $scope.submitForm = function () {
            $scope.formIsValid = validateForm();
            if (!$scope.formIsValid) {
                return;
            }
            $log.info('submitting form');
            _postMessage('widget_play',{});
        };

        function sendProperties(){
            $log.info('posting properties');
            _postMessage('widget_recipe_properties',  RecipePropertiesService.bluSolo.aws.toProperties($scope.execution));
        }

        $scope.$watch('execution', sendProperties ,true);


        $scope.$watch('loginDetails', function(){
            $log.info('posting advanced data');
            postAdvancedData( { 'username' : $scope.loginDetails.softlayerApiKey , 'apiKey' : $scope.loginDetails.softlayerApiSecretKey}  );
        },true);


        $scope.$watch('awsLoginDetails', function(){

            $log.info('posting aws login details');
//            {'type':'aws_ec2', 'params' : {'key':null, 'secretKey':null} }
            postAdvancedData( { 'type' : 'aws_ec2' , 'params' : $scope.awsLoginDetails } );

        }, true);

        function postAdvancedData( advancedData ){
            // {'username':, 'apiKey':null}
            _postMessage('widget_advanced_data', advancedData );
        }

        function _postMessage ( name, data ){
            // {'type':'softlayer', 'params' : {'username':'guy', 'apiKey':null} }
            // 'widget_advanced_data'
            try {
                $('iframe')[0].contentWindow.postMessage({ 'name': name, 'data': data }, '*');
            }catch(e){}
        }



        function receiveMessage( e ){
            $log.info('parent got message ', e.data );
            var messageData = angular.fromJson(e.data);

            if ( messageData.name === 'widget_loaded'){

                $scope.widgetLoaded = true;
                sendProperties();
            }

            $scope.$apply();
        }

        window.addEventListener('message', receiveMessage, false);
    });
