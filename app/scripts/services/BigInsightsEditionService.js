'use strict';

angular.module('cloudifyWidgetPagesApp')
    .service('BigInsightsEditionService', function BigInsightsEditionService($q) {
        // currently not supported in recipe, ignore for now.
        var biginsightsEdition = [
            { 'id': 'enterprise-production', 'label': 'enterpriseProduction' } ,
            { 'id': 'enterprise', 'label': 'enterprise'},
            { 'id': 'standard-production', 'label': 'standardProduction'},
            { 'id': 'standard', 'label': 'standard' },
            { 'id': 'quickstart', 'label': 'quickstart'}
        ];

        this.getByLabel = function (label) {
            return biginsightsEdition.filter(function (o) {
                return o.label === label;
            })[0];
        };

        this.getDefaultValue = function () {
            return this.getByLabel('quickstart');
        };

        this.getEditions = function () {
            var deferred = $q.defer();

            deferred.resolve(biginsightsEdition);

            return deferred.promise;
        };

    });
