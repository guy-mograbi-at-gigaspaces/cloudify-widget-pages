'use strict';

angular.module('cloudifyWidgetPagesApp')
    .service('SoftlayerPackageItemsService', function SoftlayerPackageItemsService($http) {
        this.getItems = function (username, password) {
            $http.get('https://' + username + ':' + password + 'api.softlayer.com/rest/v3/SoftLayer_Product_Package/ActiveItems.json');
        };
    });
