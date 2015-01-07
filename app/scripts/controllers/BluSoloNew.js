/**
 * Created by sefi on 14/12/14.
 */
'use strict';

angular.module('cloudifyWidgetPagesApp')
    .controller('BluSoloNewCtrl', function ($scope, $log, $controller, DataCenterService, AwsData, $location, $routeParams, CloudDataService, AppConstants, RecipePropertiesService, BluSoloFormValidator, PossibleErrorsService) {

        $scope.data = CloudDataService;
        $scope.showWidget = window === window.parent;


        $controller('GsGenericCtrl', {$scope: $scope});
        $scope.genericWidgetModel.element = function () {
            return $('iframe')[0];
        };


        $scope.cloudProviders = [
            {
                'label': 'AWS',
                'id': AppConstants.CloudProviders.AWS
            }//,
//            {
//                'label': 'Softlayer',
//                'id': AppConstants.CloudProviders.Softlayer
//            }
        ];

//        $scope.data.softlayer.ram ={ 'data' :  [
//            {
//                'id' : '1155',
//                'name' : '32gb'
//            },
//            {
//                'id' : '4468',
//                'name' : '48gb'
//            },
//            {
//                'id' : '1154',
//                'name' : '64gb'
//            }
//        ] } ;

//        $scope.data.softlayer.cores =  { 'data' : [
//            {
//                'id' : '860',
//                'name' : '8x2g'
//            },
//            {
//                'id' : '1198',
//                'name' : '12x2g'
//            },
//            {
//                'id' : '1194',
//                'name' : '16x2g'
//            }
//        ]};
//
//        $scope.data.softlayer.disks = {'data' : [
//            {
//                'id' : '865',
//                'name' : '100gbsan'
//            }
//        ]};


        function changeWidgetUrl() {
            $scope.widgetUrl = 'http://thewidget.staging.gsdev.info/#/widgets/' + widgetIds[$scope.execution.cloudProvider] + '/blank';
//            $scope.widgetUrl = 'http://localhost.com:9000/#/widgets/53d651d37818c889b6619020/blank';
        }

        var widgetIds = {};
        widgetIds[AppConstants.CloudProviders.AWS] = '548d7da2353b591552beeeb5';
//        widgetIds[AppConstants.CloudProviders.Softlayer] = '0375c7bb-c070-4b80-970b-eaec99fccfc7';

//        $scope.softlayerLoginDetails = { 'type' : 'softlayer' , 'params' : { 'username' : null, 'apiKey' : null } };
        $scope.awsLoginDetails = { 'params' : { 'apiKey' : null, 'secretKey': null } };

        $scope.execution = {
            'cloudProvider': $routeParams.cloudProvider || AppConstants.CloudProviders.AWS,
            'softlayerAccount': '',
            'aws' : {
                'region': $scope.data.aws.region.data[0].id,
                'instanceType': $scope.data.aws.instanceType.data[0].id,
                'securityGroup': null
            }
//            ,
//            'softlayer' : {
//                'dataCenter' : $scope.data.softlayer.dataCenter.data[0].id,
//                'core' : $scope.data.softlayer.cores.data[0].id,
//                'ram' : $scope.data.softlayer.ram.data[0].id,
//                'disk' : $scope.data.softlayer.disks.data[0].id
//            }
        };

        changeWidgetUrl();

//        $scope.$watch('execution.aws.securityGroup', function( newValue/*, oldValue*/ ){
//            $scope.genericWidgetModel.ec2Details.securityGroupName = newValue;
//        });

        $scope.$watch('execution.cloudProvider', function( newValue , oldValue ){
            if ( !!newValue && !!oldValue && newValue !== oldValue ){
                $location.search('cloudProvider', newValue);
            }

            if ($scope.execution.cloudProvider === AppConstants.CloudProviders.AWS ){
                $scope.genericWidgetModel.advancedData = $scope.awsLoginDetails;
            }else{
                $scope.genericWidgetModel.advancedData = $scope.softlayerLoginDetails;
            }
        });

        $scope.$watch(function(){ return $routeParams.cloudProvider; }, function(){
            $scope.execution.cloudProvider = $routeParams.cloudProvider || AppConstants.CloudProviders.AWS;
            changeWidgetUrl();
        });

        $scope.formIsValid = false;

        function validateForm() {
            $scope.formErrors = null;
            $scope.formErrors =  BluSoloFormValidator.validateForm($scope);
            return !$scope.formErrors;
        }


        $scope.$watch( function(){ return $scope.genericWidgetModel.leadDetails; }, function updateLoginDetails(){

            $scope.genericWidgetModel.loginDetails = {
                'email': $scope.genericWidgetModel.leadDetails.email,
                'name': $scope.genericWidgetModel.leadDetails.firstName,
                'lastName': $scope.genericWidgetModel.leadDetails.lastName
            };

        }, true);


        // lets scan for possible errors in the output and add possible errors.
        $scope.$watch(function() { return $scope.genericWidgetModel.widgetStatus; }, function(  ){
            $scope.possibleErrors = PossibleErrorsService.detect( $scope.genericWidgetModel.widgetStatus.output, $scope.genericWidgetModel.widgetStatus.error);
        },true);


        $scope.submitForm = function () {
            updateProperties('from submit');
            $scope.formIsValid = validateForm();
            if (!$scope.formIsValid) {
                return;
            }
            $log.info('submitting form');
            $scope.possibleErrors = null;
            $scope.playWidget();

        };

        function updateProperties( newValue ){
            $log.info('updating properties. widget loaded', newValue);
            $scope.sentProperties = RecipePropertiesService.bluSolo.toProperties($scope.execution);
            $scope.genericWidgetModel.recipeProperties = $scope.sentProperties;
        }
        $scope.$watch('execution', updateProperties ,true);
        $scope.$watch(function(){ return $scope.genericWidgetModel.loaded; }, updateProperties );


    });
