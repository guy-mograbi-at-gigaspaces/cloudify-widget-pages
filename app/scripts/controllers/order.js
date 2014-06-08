'use strict';

angular.module('ibmBiginsightsUiApp')
    .controller('OrderCtrl', function ($scope) {

        $scope.model = {
            'datacenter': 'Washington, DC 1',
            'edition': 'enterprise-production',
            'filesystem': 'hdfs',
            'masterDevice': 'bare_metal_server',
            'masterDiskMax': '4',
            'masterCpu': 'Xeon 5620',
            'masterRam': '96',
            'masterDisk': '500GB SATA II',
            'masterRaid': true,
            'masterNetwork': '1G',
            'masterOs': 'RHEL',
            'masterLicense': 'Enterprise Production Environment',
            'datanodes': 3,
            'dataDevice': 'bare_metal_server',
            'datanodesDiskMax': 24,
            'datanodeCpu': 'Xeon 5620',
            'datanodeRam': 128,
            'datanodeDisk1': '500GB SATA II',
            'dataRaid': true,
            'datanodesDisk': 6,
            'datanodesDisk2': 1,
            'dataNetwork': '1G',
            'dataOs': 'RHEL',
            'dataLicense': 'Enterprise Production Environment'
        };

        var accordion = 1;

        $scope.toggleAccordion = function (panel) {
            if (accordion === panel) {
                accordion = null;
            }
            else {
                accordion = panel;
            }
        };

        $scope.collapsePanel = function (panel) {
            if (accordion !== panel) {
                return 'collapse';
            }
        };

        $scope.reviewCluster = function () {
            console.log(['reviewCluster', $scope.model]);
        };

    });
