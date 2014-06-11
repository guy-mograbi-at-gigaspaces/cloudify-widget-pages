'use strict';

angular.module('ibmBiginsightsUiApp')
    .service('DisksService', function DisksService($q) {

        var disks = {
            'bm': [
                {
                    'id': '14',
                    'label': '05',
                    'size': 0.5

                },
                {
                    'id': '471',
                    'label': '1',
                    'size': 1
                },
                {
                    'id': '1091',
                    'label': '2',
                    'size': 2
                },
                {
                    'id': '3989',
                    'label': '3',
                    'size': 3
                },
                {
                    'id': '4281',
                    'label': '4',
                    'size': 4
                }
            ],
            'cci': [
                {
                    'id': '865',
                    'label': '100',
                    'size': 100
                },
                {
                    'id': '866',
                    'label': '250',
                    'size': 250

                },
                {
                    'id': '1225',
                    'label': '300',
                    'size': 300

                },
                {
                    'id': '1226',
                    'label': '350',
                    'size': 350

                },
                {
                    'id': '1227',
                    'label': '400',
                    'size': 400

                },
                {
                    'id': '916',
                    'label': '500',
                    'size': 500

                },
                {
                    'id': '1229',
                    'label': '750',
                    'size': 750

                },
                {
                    'id': '1230',
                    'label': '1000',
                    'size': 1000

                },
                {
                    'id': '1231',
                    'label': '1500',
                    'size': 1500

                },
                {
                    'id': '1232',
                    'label': '2000',
                    'size': 2000

                }
            ]

        };


        this.getByLabel = function (collection, label) {
            return collection.filter(function (o) {
                return o.label === label;
            })[0];
        };

        this.getById = function (collection, id) {
            return collection.filter(function (o) {
                return o.id === id;
            })[0];
        };

        this.getDefaultValue = function () {
            return {
                'bm': this.getByLabel(disks.bm, '05').id,
                'cci': this.getByLabel(disks.cci, '250').id
            };
        };

        this.get = function () {
            var deferred = $q.defer();
            deferred.resolve(disks);
            return deferred.promise;
        };

    });
