'use strict';

angular.module('cloudifyWidgetPagesApp')
    .service('BluSoloAwsProperties', function BluSoloAwsProperties() {
        // AngularJS will instantiate a singleton by calling "new" on this function
//        this.aws = BluSoloAwsProperties;

        this.toProperties = function (execution) {
            var result = [];

            // according to provider section "managementGroup"
            result.push({'key' : 'MANAGEMENT_NAME_PREFIX' , 'value' : 'blusolomanager-' + new Date().getTime() });

            if ( !!execution.aws ) {
                if (!!execution.aws.securityGroup) {
                    result.push({ 'key': 'BLU_EC2_SECURITY_GROUP', 'value': execution.aws.securityGroup });
                }

                if ( execution.db2express ) {
                    result.push({'key': 'db2expressRandomValue', 'value': execution.db2express.randomValue });
                }

                if (!!execution.aws.region) {
                    result.push({'key': 'EC2_REGION', 'value': execution.aws.region });
                }

                if (!!execution.aws.instanceType) {
                    result.push({'key': 'BLU_EC2_HARDWARE_ID', 'value': execution.aws.instanceType });
                }
            }

            return result;
        };
    });
