'use strict';

angular.module('ibmBiginsightsUiApp')
  .service('BluSoloFormValidator', function BluSoloFormValidator( AppConstants ) {
    // AngularJS will instantiate a singleton by calling "new" on this function

        /**
         * returns errors list
         * @param scope
         */
        this.validateForm = function( $scope ){


            var commonErrors = this.validateCommonErrors($scope);

            var specificErrors = null;


            if ( $scope.execution.cloudProvider === AppConstants.CloudProviders.Softlayer ){
                specificErrors =  this.validateSoftlayerDetails($scope);

            }else if ( $scope.execution.cloudProvider === AppConstants.CloudProviders.AWS ){
                specificErrors = this.validateAwsEc2Details($scope);
            }

            if ( commonErrors !== null && specificErrors !== null ){
                return _.merge(commonErrors,specificErrors);
            }

            if ( commonErrors !== null ){
                return commonErrors;
            }

            if ( specificErrors !== null ){
                return specificErrors;
            }

            return null;
        };

        this.validateSoftlayerDetails = function ($scope) {
            var result = {};
            var params = $scope.softlayerLoginDetails.params;
            if (_.isEmpty(params.username)) {
                result.username = 'invalid';
            }

            if (_.isEmpty(params.apiKey)) {
                result.apiKey = 'invalid';
            }

            return _.isEmpty(result) ? null : result;
        };

        this.validateAwsEc2Details = function ($scope) {
            var result = {};

            var params = $scope.awsLoginDetails.params;
            var awsExecution = $scope.execution.aws;

            if (_.isEmpty(params.key)) {
                result.key = 'invalid';
            }

            if (_.isEmpty(params.secretKey)) {
                result.secretKey = 'invalid';
            }

            if (_.isEmpty(awsExecution.securityGroup)) {
                result.securityGroup = 'invalid';
            }

            return _.isEmpty(result) ? null : result;
        };

        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        this.validateCommonErrors = function( $scope ){
            var result = {};
            var leadDetails = $scope.genericWidgetModel.leadDetails;

            if ( !leadDetails.email || !validateEmail(leadDetails.email) ){
                result.email = 'invalid';
            }

            if (_.isEmpty(leadDetails.firstName) || _.isEmpty(leadDetails.lastName) ){
                result.name = 'invalid';
            }

            if (_.isEmpty(leadDetails.companyName)){
                result.company = 'invalid';
            }

            if ( !$scope.execution.agreed ){
                result.agreed = 'invalid';
            }

            return _.isEmpty(result) ? null : result;
        };
    });
