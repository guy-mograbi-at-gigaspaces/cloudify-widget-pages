'use strict';

angular.module('cloudifyWidgetPagesApp')
    .service('FilesystemTypesService', function FilesystemTypesService($q) {


        var types = [
            {
                'id': 'hdfs',
                'label': 'hdfs'
            },
            {
                'id': 'gpfs',
                'label': 'gpfs',
                'disabled': true
            }
        ];

        this.getByLabel = function (label) {
            return types.filter(function (o) {
                return o.label === label;
            })[0];
        };

        this.getDefaultValue = function () {
            return this.getByLabel('hdfs');
        };


        this.getTypes = function () {
            var deferred = $q.defer();
            deferred.resolve(types);
            return deferred.promise;
        };


        // AngularJS will instantiate a singleton by calling "new" on this function
    });
