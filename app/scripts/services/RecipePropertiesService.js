'use strict';

angular.module('ibmBiginsightsUiApp')
    .service('RecipePropertiesService', function RecipePropertiesService(ServerTypesService, BluSoloProperties) {

        this.bluSolo = BluSoloProperties;


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

            add('locationId', input.locationId, 10);
            add('packageId', parseInt(input.masterPackage, 10));
//            add('dataPackage', parseInt(input.dataPackage,10));


            function isMasterBareMetal() {
                return ServerTypesService.isBareMetal(input.masterPackage);
            }

            function isDataBareMetal() {
                return ServerTypesService.isBareMetal(input.masterPackage);

//                return ServerTypesService.isBareMetal(input.dataPackage);
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

            add('smallHardwareId', masterHardwareIdValue);
            add('largeHardwareId', dataHardwareIdValue);

            if (isMasterBareMetal() && !!input.masterRaid) {
                add('smallLinuxOtherHardDisksIDs', '14');
            } else {
                add('smallLinuxOtherHardDisksIDs', '');
            }

            var dataNumberOfDisks = isDataBareMetal() ? input.dataBareMetalNumberOfDisks : input.dataCciNumberOfDisks;
            var dataDisks = isDataBareMetal() ? input.dataBareMetalDisks : input.dataCciDisks;


            var dataOtherHardDisksIDsArray = [];

            if (!!input.dataRaid && isDataBareMetal()) {
                dataOtherHardDisksIDsArray.push('14');
            }

            for (var i = 0; i < dataNumberOfDisks; i++) {
                dataOtherHardDisksIDsArray.push(dataDisks);
            }
            add('largeLinuxOtherHardDisksIDs', dataOtherHardDisksIDsArray.join(','));


            if (isMasterBareMetal()) {
                add('masterDiskControllerID', 487);
            } else {
                add('masterDiskControllerID', '');

            }

            if (isDataBareMetal()) {
                add('dataDiskControllerID', 487);
            } else {
                add('dataDiskControllerID', '');

            }


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

            add('linuxImageId', masterImageIdValue + '');
//            add('dataLinuxImageId', dataImageIdValue);


            // recipes properties
            add('currentAppName', 'bi' + this.getRandomTag() + '_cloudify');
            add('numOfDataNodes', parseInt(input.numOfDataNodes, 10));

            add('maxNumOfDataNodes', 10);
            add('masterComputeTemplate', input.masterComputeTemplate);
            add('dataNodesComputeTemplate', input.dataNodesComputeTemplate);
            add('infoFileName', input.infoFileName);
            add('tag', this.getRandomTag());
            add('biAdminPassword', input.biAdminPassword);

            var myTag = this.getRandomTag();

            function getPrefix(isBare, suffix) {
                return 'bi' + ( isBare ? 'bm' : 'cci' ) + myTag + suffix;
            }

            add('MANAGER_PREFIX', getPrefix(isMasterBareMetal(), 'mngr'));
            add('AGENT_PREFIX', getPrefix(isDataBareMetal(), 'agent'));


            return properties;
        };

    });
