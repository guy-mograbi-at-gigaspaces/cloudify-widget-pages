'use strict';

angular.module('cloudifyWidgetPagesApp')
    .service('CpuService', function CpuService($q) {
        var bmCpu = [
            {
                'id': '1111',
                'label': 'xeon5620'
            }
        ];


        var cciMasterCpu = [
            {
                'id': '859',
                'label': '4',
                'disabled': true
            },
            {
                'id': '860',
                'label': '8'
            },

            {
                'id': '1194',
                'label': '16'
            }

        ];

        var cciDataCpu = [

            {
                'id': '859',
                'label': '4',
                'disabled': true
            },
            {
                'id': '860',
                'label': '8'
            },

            {
                'id': '1194',
                'label': '16'
            }

        ];


        this.getByLabel = function (collection, label) {
            return collection.filter(function (o) {
                return o.label === label;
            })[0];
        };

        this.getDefaultValue = function () {
            return {
                'bm': this.getByLabel(bmCpu, 'xeon5620').id,
                'cciMaster': this.getByLabel(cciMasterCpu, '8').id,
                'cciData': this.getByLabel(cciDataCpu, '8').id
            };
        };

        this.get = function () {
            var deferred = $q.defer();
            deferred.resolve(
                { 'bm': bmCpu, 'cciMaster': cciMasterCpu, 'cciData': cciDataCpu }
            );
            return deferred.promise;
        };


    });
