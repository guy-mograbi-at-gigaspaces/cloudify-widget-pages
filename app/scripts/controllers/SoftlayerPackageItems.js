'use strict';

angular.module('ibmBiginsightsUiApp')
    .controller('SoftlayerPackageItemsCtrl', function ($scope, $http, SoftlayerPackageItemsService, $timeout) {


        function loadItems() {
            if (typeof(softlayerItems) !== 'undefined') {
                $scope.softlayerItems = softlayerItems;
            } else {
                $timeout(loadItems, 10);
            }
        }

        loadItems();


        $scope.loadCachedItems = function () {
            $scope.items = $http.get('https://www.dropbox.com/s/if4akhffs2m4avb/data.json?dl=1').data;
        };

        $scope.loginDetails = {};
        $scope.loadItems = function () {
            SoftlayerPackageItemsService.getItems($scope.loginDetails.username, $scope.loginDetails.apiKey);
        };
    });
