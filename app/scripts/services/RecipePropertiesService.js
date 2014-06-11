'use strict';

angular.module('ibmBiginsightsUiApp')
    .service('RecipePropertiesService', function RecipePropertiesService(ServerTypesService) {




        // biginsights license ==== always equals the edition


        this.getRandomTag = function () {
            return 100000 + Math.floor(Math.random() * 99999);
        };


        this.toCloudifyProperties = function (input) {
            var properties = [];


            if (!input) {
                return properties;
            }

            function add(key, value) {
                properties.push({ 'key': key, 'value': value });
            }

            add('locationId', parseInt(input.locationId,10));
            add('masterPackage', parseInt(input.masterPackage,10));
            add('dataPackage', parseInt(input.dataPackage,10));


            function isMasterBareMetal() {
                return ServerTypesService.isBareMetal(input.masterPackage);
            }

            function isDataBareMetal() {
                return ServerTypesService.isBareMetal(input.dataPackage);
            }

            // hardwareId="CPU,RAM,1st HardDisk,Uplink ports speed and Bandwidth. Use the following two(hard codedd) as the last two: 1284,249

            var masterHardwareIdValue = null;
            var dataHardwareIdValue = null;
            if (isMasterBareMetal()) {
                masterHardwareIdValue = input.masterBareMetalCpu + ',' + input.masterBareMetalRam + ',' + /* first disk bare metal */ 14 + ',1284,249';
            } else {
                masterHardwareIdValue = input.masterCciCpu + ',' + input.masterCciRam + ',' + /* first disk cci */ 865 + ',188,439';
            }

            if (isDataBareMetal()) {
                dataHardwareIdValue = input.dataBareMetalCpu + ',' + input.dataBareMetalRam + ',' + /* first disk bare metal */ 14 + ',1284,249';
            } else {
                dataHardwareIdValue = input.dataCciCpu + ',' + input.dataCciRam + ',' + /* first disk cci */ 865 + ',188,439';
            }

            add('masterHardwareId', masterHardwareIdValue);
            add('dataHardwareId', dataHardwareIdValue);


            add('masterOtherHardDisksIDs', '???');
            add('dataOtherHardDisksIDs', '???');
            add('masterDiskControllerID', '???');
            add('dataDiskControllerID', '???');


            var masterImageIdValue = '???';
            var dataImageIdValue = '???';
            if (isMasterBareMetal()) {
                masterImageIdValue = input.masterBareMetalImage;
            } else {
                masterImageIdValue = input.masterCciImage;

            }

            if (isDataBareMetal()) {
                dataImageIdValue = input.dataBareMetalImage;
            } else {
                dataImageIdValue = input.dataCciImage;
            }

            add('masterLinuxImageId', masterImageIdValue);
            add('dataLinuxImageId', dataImageIdValue);


            // recipes properties

            add('numOfDataNodes', 2);

            add('maxNumOfDataNodes', 10);
            add('masterComputeTemplate', input.masterComputeTemplate);
            add('dataNodesComputeTemplate', input.dataNodesComputeTemplate);
            add('infoFileName', input.infoFileName);
            add('tag', input.tag);
            add('biAdminPassword', input.biAdminPassword);


            return properties;
        };

    });
