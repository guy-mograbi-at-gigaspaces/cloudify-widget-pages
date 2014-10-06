'use strict';

angular.module('ibmBiginsightsUiApp')
    .service('BluSoloProperties', function BluSoloProperties(BluSoloAwsProperties, BluSoloSoftlayerProperties, AppConstants) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.aws = BluSoloAwsProperties;
        this.softlayer = BluSoloSoftlayerProperties;


        this.toProperties = function (execution) {
            if (execution.cloudProvider === AppConstants.CloudProviders.AWS) {
                return this.aws.toProperties(execution);
            } else if (execution.cloudProvider === AppConstants.CloudProviders.Softlayer) {
                return this.softlayer.toProperties(execution);
            }
        };
    });
