'use strict';

angular.module('cloudifyWidgetPagesApp')
    .service('RamService', function RamService( $q ) {
        var ramTypes = {
            'cci': [
                {
                    'id' : '1017',
                    'label' : '16'

                },
                {
                    'id' : '1155',
                    'label' : '32'
                },
                {
                    'id' : '1154',
                    'label' : '64'
                },
                {
                    'id' : '4468',
                    'label' : '48'
                }
            ],
            'bmMaster' : [
                {
                    'id': '826',
                    'label' : '24'
                },
                {
                    'id' : '828',
                    'label' : '48'
                },
                {
                    'id' : '1050',
                    'label' : '96'
                }
            ],
            'bmData' : [
                {
                    'id': '826',
                    'label' : '24'
                },
                {
                    'id' : '828',
                    'label' : '48'
                },{
                    'id' : '1050',
                    'label' : '96'
                },{
                    'id' : '1307',
                    'label' : '128'
                },
                {
                    'id' : '1147',
                    'label' : '192'
                }
            ]
        };


        this.getByLabel = function( collection, label ){
            return collection.filter(function(o){ return o.label === label; })[0];
        };

        this.getDefaultValue = function(){
            return {
                'cci' : this.getByLabel( ramTypes.cci, '32').id,
                'bmMaster' : this.getByLabel( ramTypes.bmMaster, '24').id,
                'bmData' : this.getByLabel( ramTypes. bmData, '24').id
            };
        };

        this.get = function( ){
            var deferred = $q.defer();
            deferred.resolve(ramTypes);
            return deferred.promise;
        };
    });
