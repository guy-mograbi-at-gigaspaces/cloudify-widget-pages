'use strict';

/**
 * @ngdoc function
 * @name ibmBiginsightsUiApp.controller:BlufreeCtrl
 * @description
 * # BlufreeCtrl
 * Controller of the ibmBiginsightsUiApp
 */
angular.module('cloudifyWidgetPagesApp')
    .controller('BluFreeCtrl', function ($scope, $controller, $location, $log ) {

        $controller('GsGenericCtrl', {$scope: $scope});
        $scope.genericWidgetModel.element = function () {
            return $('iframe[widget]')[0];
        };

        // first one should be the default!
        var environments = [
            {
                'host' : 'ibmpages',
                'url' : 'http://thewidget.gsdev.info/#/widgets/5447744cbfd521015967f580/blank?timestamp=' + new Date().getTime()
            },
            {
                'host': 'ibmstaging',
                'url': 'http://thewidget.staging.gsdev.info/#/widgets/548d7da2353b591552beeeb5/blank?timestamp=' + new Date().getTime()
            },
            {
                'host': 'localhost.com',
                'url': 'http://thewidget.staging.gsdev.info/#/widgets/548d7da2353b591552beeeb5/blank?timestamp=' + new Date().getTime()
            },
            {
                'host': 'guym',
                'url': 'http://127.0.0.1:9000/#/widgets/54adb6777b0a8eca14329a54/blank?timestamp=' + new Date().getTime()
            },
            {
                'host': 'sefi',
                'url': 'http://127.0.0.1:9000/#/widgets/53d651d37818c889b6619020/blank?timestamp=' + new Date().getTime()
            }
        ];

        var environment = _.find(environments, function(env){

            return $location.host().indexOf(env.host) >= 0;
        });

        if ( !environment ){ // first one should always be default
            $log.warn('please update environments information! using default!!');
            environment = environments[0];
        }

        $scope.environment = environment;




        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    });
