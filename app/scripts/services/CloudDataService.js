'use strict';

angular.module('ibmBiginsightsUiApp')
    .service('CloudDataService', function CloudDataService(AwsData, SoftlayerData) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.aws = AwsData;
        this.softlayer = SoftlayerData;
    });
