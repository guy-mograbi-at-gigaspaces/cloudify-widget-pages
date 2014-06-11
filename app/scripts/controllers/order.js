'use strict';

angular.module('ibmBiginsightsUiApp')
    .controller('OrderCtrl', function ($scope, Client, $log, RecipePropertiesService) {


        Client.dataCenters.getDataCenters().then(function(result){
            $log.info('got datacenters', result);
            $scope.dataCenters = result;
        });

        Client.biginsightsEditions.getEditions().then( function(result ){
            $scope.editions = result;
        });

        Client.filesystemTypes.getTypes().then( function(result){
            $scope.fsTypes = result;
        });

        Client.serverTypes.getTypes().then( function(result){
            $scope.serverTypes = result;
        });

        Client.cpu.get().then( function(result){
            $scope.cpu = result;
        });

        Client.ram.get().then( function(result){
            $scope.ram = result;
        });

        Client.disks.get().then( function(result){
            $scope.disks = result;
        });

        $scope.isMasterBareMetal = function(){
            return Client.serverTypes.isBareMetal( $scope.input.masterPackage );
        };

        $scope.isDataBareMetal = function(){
            return Client.serverTypes.isBareMetal( $scope.input.dataPackage );
        };


        $scope.$watch('input', function(){
            $log.info('to properties', $scope.input);
            $scope.recipeProperties = RecipePropertiesService.toCloudifyProperties($scope.input);



            var targetOrigin = frames[0].location.origin;
            if ( !!targetOrigin  ) {
                frames[0].postMessage({'name': 'widget_recipe_properties', 'data': $scope.recipeProperties }, frames[0].location.origin);
            }
        }, true);


        $scope.input = {
            'masterPackage' : Client.serverTypes.getDefaultValue(),
            'dataPackage' : Client.serverTypes.getDefaultValue(),
            'locationId' : Client.dataCenters.getDefaultValue(),
            'tag' : RecipePropertiesService.getRandomTag(),
            'numOfDataNodes' : 2,
            'maxNumOfDataNodes' : 10,
            'masterComputeTemplate' : 'MASTER_NODE',
            'dataNodesComputeTemplate' : 'DATA_NODE',
            'infoFileName' : 'data.info',
            'biAdminPassword' : 'adminPassword',
            'masterBareMetalCpu' : Client.cpu.getDefaultValue().bm,
            'masterCciCpu' : Client.cpu.getDefaultValue().cciMaster,
            'dataBareMetalCpu' : Client.cpu.getDefaultValue().bm,
            'dataCciCpu' : Client.cpu.getDefaultValue().cciData,
            'masterBareMetalRam' : Client.ram.getDefaultValue().bmMaster,
            'masterCciRam' : Client.ram.getDefaultValue().cci,
            'dataBareMetalRam' : Client.ram.getDefaultValue().bmData,
            'dataCciRam' : Client.ram.getDefaultValue().cci,
            'numberOfDataNodes' : 3,
            'dataMaxInternalDrives':24,
            'dataCciNumberOfDisks':1,
            'dataBareMetalNumberOfDisks' : 6,
            'dataBareMetalDisks' : Client.disks.getDefaultValue().bm,
            'dataCciDisks' : Client.disks.getDefaultValue().cci,
            'masterBareMetalImage' : 4321,
            'masterCciImage' : 3839,
            'dataBareMetalImage' : 4321,
            'dataCciImage' : 3839

        };


        $scope.totalDiskSize = function(){
            if ( $scope.isDataBareMetal() ){
                return Client.disks.getById( $scope.disks.bm, $scope.input.dataBareMetalDisks).size * $scope.input.dataBareMetalNumberOfDisks + '.00 GB'
            }else{
                return Client.disks.getById( $scope.disks.cci, $scope.input.dataCciDisks).size * $scope.input.dataCciNumberOfDisks + '.00 GB'
            }

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
                return 'collapsing';
            }
            return '';
        };



    });
