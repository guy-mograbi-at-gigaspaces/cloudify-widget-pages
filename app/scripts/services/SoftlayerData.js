'use strict';

angular.module('cloudifyWidgetPagesApp')
    .service('SoftlayerData', function SoftlayerData(DataCenterService
        ) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.dataCenter = DataCenterService;
    });
