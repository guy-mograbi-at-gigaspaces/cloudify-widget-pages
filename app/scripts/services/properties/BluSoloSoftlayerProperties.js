'use strict';

angular.module('cloudifyWidgetPagesApp')
    .service('BluSoloSoftlayerProperties', function BluSoloSoftlayerProperties( /*$log*/ ) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.toProperties = function (execution) {
            var result = [];

            // according to provider section "managementGroup"
            result.push({'key' : 'widgetManagementGroup' , 'value' : 'blusolomanager-' + new Date().getTime() });

            if ( !!execution.softlayer ){
                if ( !!execution.softlayer.dataCenter ){
                    result.push({'key' : 'locationId' , 'value' : execution.softlayer.dataCenter });
                }

                if ( execution.db2express ) {
                    result.push({'key': 'db2expressRandomValue', 'value': execution.db2express.randomValue });
                }

                var hardwareIds = [];
                if ( !!execution.softlayer.core ){
                    hardwareIds.push(execution.softlayer.core);
                }

                if ( !!execution.softlayer.ram ){
                    hardwareIds.push(execution.softlayer.ram);
                }

                if ( !!execution.softlayer.disk ){
                    hardwareIds.push(execution.softlayer.disk);
                }

                result.push({'key' : 'hardwareId' , 'value' : hardwareIds.join(',') });
            }

            return result;
        };
    });
