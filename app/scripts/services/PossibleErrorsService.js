'use strict';

angular.module('ibmBiginsightsUiApp')
    .service('PossibleErrorsService', function PossibleErrorsService() {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var items = [
            {
                'pattern': 'Failed to create Cloudify Management VM: Error org.jclouds.rest.AuthorizationException',
                'error': 'causes.imageUnauthorized.error',
                'action': 'causes.imageUnauthorized.action'
            },
            {
                'pattern': '',
                'error': null,
                'action': 'causes.callSupport.action'
            },
            {
                'pattern': 'missing image to share details',
                'error': null,
                'action': 'causes.callSupport.action'
            },
            {
                'pattern': 'unable to share image. please register to marketplace',
                'error': 'causes.notRegisteredToMarketplace.error',
                'action': 'causes.notRegisteredToMarketplace.action'
            },
            {
                'pattern': 'security group configuration incomplete. make sure you follow the instructions',
                'error': 'causes.invalidSecurityGroup.error',
                'action': 'causes.invalidSecurityGroup.action'
            },
            {
                'pattern': 'invalid security group. make sure you follow the instructions',
                'error': 'causes.invalidSecurityGroup.error',
                'action': 'causes.invalidSecurityGroup.action'
            },
            {
                'pattern': 'unable to parse ec2 execution details',
                'error': null,
                'action': 'causes.callSupport.action'
            }
        ];


        function addToResult(result, item, line) {
            if (line.match(item.pattern) !== null) {
                if (!_.find(result, { 'error': item.error, 'action': item.action })) {
                    result.push(item);
                }
            }
        }

        this.detect = function (output, message) {
            if (!output || output.length === 0) {
                return null;
            }
            var result = [];
            _.each(output, function (line) {
                _.each(items, function (item) {
                    addToResult(result, item, line);
                });
            });

            _.each(items, function (item) {
                if (message.match(item) !== null) {
                    addToResult(result, item, message);
                }
            });

            return result.length === 0 ? null : result;
        };

    });
