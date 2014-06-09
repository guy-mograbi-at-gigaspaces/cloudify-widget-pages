'use strict';

angular.module('ibmBiginsightsUiApp')
    .controller('OrderCtrl', function ($scope) {

        var accordion = 1;
        var realNames = {
            'masterDevice': 'master-device',
            'masterDiskMax': 'master-disk-max',
            'masterCpu': 'master-cpu',
            'masterRam': 'master-ram',
            'masterDisk': 'master-disk',
            'masterRaid': 'master-raid',
            'masterNetwork': 'master-network',
            'masterOs': 'master-os',
            'masterLicense': 'master-license',
            'dataDevice': 'data-device',
            'datanodesDiskMax': 'datanodes-disk-max',
            'datanodeCpu': 'datanode-cpu',
            'datanodeRam': 'datanode-ram',
            'datanodeDisk1': 'datanode-disk1',
            'dataRaid': 'data-raid',
            'datanodesDisk': 'datanodes-disk',
            'datanodesDisk2': 'datanodes-disk2',
            'dataNetwork': 'data-network',
            'dataOs': 'data-os',
            'dataLicense': 'data-license'
        };

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
            console.log(['reviewCluster', convertModelToRealNames($scope.model)]);
        };

        function convertModelToRealNames(dataModel) {
            var result = {};
            for(var i in dataModel) {
                if(realNames.hasOwnProperty(i)) {
                    result[realNames[i]] = $scope.model[i];
                }
                else {
                    result[i] = $scope.model[i];
                }
            }
            return result;
        }

    });
