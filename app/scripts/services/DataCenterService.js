'use strict';

angular.module('ibmBiginsightsUiApp')
    .service('DataCenterService', function DataCenterService($q) {

        var dataCenters = [
            { 'id' : '265592' ,      'label' : 'amsterdam1' },
            { 'id' : '3' ,           'label' : 'dallas1' },
            { 'id' : '138124' ,      'label' : 'dallas5' },
            { 'id' : '154820' ,      'label' : 'dallas6' },
            { 'id' : '142776' ,      'label' : 'dallas7' },
            { 'id' : '352494' ,      'label' : 'hongkong2' },
            { 'id' : '168642' ,      'label' : 'sanjose1' },
            { 'id' : '18171' ,       'label' : 'seattle' },
            { 'id' : '224092' ,      'label' : 'singapore1' },
            { 'id' : '37473' ,       'label' : 'washington1' }
        ];


        this.getByLabel = function( label ){
            for ( var i = 0; i < dataCenters.length; i ++ ){
                if ( dataCenters[i].label === label ){
                    return dataCenters[i];
                }
            }
            return null;
        };

        this.getDefaultValue = function(){
            return this.getByLabel('washington1').id;
        };



        this.getDataCenters = function () {
            var deferred = $q.defer();
            deferred.resolve(dataCenters);
            return deferred.promise;
        };

    });
