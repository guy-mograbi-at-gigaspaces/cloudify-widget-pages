'use strict';

angular.module('ibmBiginsightsUiApp', ['ngRoute','gsUiInfraApp' ,'cloudifyWidgetAngularController']) // 'gsUiInfraApp'
    .config(function ($routeProvider) {
        $routeProvider
            .when('/order', {
                templateUrl: 'views/order.html',
                controller: 'OrderCtrl'
            })
            .when('/wufoo/bluSolo', {
                templateUrl: 'views/blusolo/wufoo.html'
            })
            .when('/blu', {
                templateUrl: 'views/blu.html',
                controller: 'BluCtrl'
            })
            .when('/blusolo', {
                templateUrl : 'views/blu_solo.html',
                controller: 'BluSoloCtrl'

            })
            .when('/softlayer/packages',{
                templateUrl : 'views/packageItems.html',
                controller: 'SoftlayerPackageItemsCtrl'
            })

            .when('/wrapper/bluSolo', {
                templateUrl : 'views/wrappers/bluSolo.html'
            })

            .when('/snippet/bluSolo', {
                templateUrl : 'views/snippets/bluSolo.html',
                controller: 'BluSoloCtrl',
                reloadOnSearch:false
            })
            .when('/main', {
                controller: 'MainCtrl',
                templateUrl: 'views/main.html'
            })

            .otherwise({
                'redirectTo' : '/main'
            });



    });


