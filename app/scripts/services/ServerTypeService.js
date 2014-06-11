'use strict';

angular.module('ibmBiginsightsUiApp')
    .service('ServerTypesService', function ServerTypeService( $q ) {


        var types = [
            {
                'id': 46,
                'label': 'cci'
            },
            {
                'id': 44,
                'label': 'baremetal'
            }
        ];


        this.isBareMetal = function( id ) {
            return this.getByLabel('baremetal').id === ~~id;
        };

        this.isCci = function(id){
            return this.getByLabel('cci').id === ~~id;
        };


        this.getByLabel = function( label ){
            return types.filter( function(o){ return o.label === label } )[0];
        };

        this.getDefaultValue = function(){

            return this.getByLabel('baremetal').id;
        };

        this.getTypes = function(){
            var deferred = $q.defer();
            deferred.resolve(types);
            return deferred.promise;
        }

    });
