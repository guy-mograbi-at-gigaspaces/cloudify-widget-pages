'use strict';

angular.module('ibmBiginsightsUiApp')
    .service('AwsData', function AwsData(AwsInstanceTypeService, AwsRegionService) {

        this.instanceType = AwsInstanceTypeService;
        this.region = AwsRegionService;
        // AngularJS will instantiate a singleton by calling "new" on this function
    });
