'use strict';

angular.module('ibmBiginsightsUiApp')
    .service('BluSoloAwsProperties', function BluSoloAwsProperties() {
        // AngularJS will instantiate a singleton by calling "new" on this function
//        this.aws = BluSoloAwsProperties;

        this.toProperties = function (execution) {
            var result = [];

            if (!!execution.securityGroup) {
                result.push({ 'key': 'BLU_EC2_SECURITY_GROUP', 'value': execution.securityGroup });
            }

            return result;
        };
    });
