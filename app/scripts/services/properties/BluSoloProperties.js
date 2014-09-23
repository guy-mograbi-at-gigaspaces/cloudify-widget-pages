'use strict';

angular.module('ibmBiginsightsUiApp')
    .service('BluSoloProperties', function BluSoloProperties( BluSoloAwsProperties ) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.aws = BluSoloAwsProperties;
    });
