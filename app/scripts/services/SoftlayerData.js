'use strict';

angular.module('ibmBiginsightsUiApp')
    .service('SoftlayerData', function SoftlayerData(DataCenterService
        ) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.dataCenter = DataCenterService;
    });
