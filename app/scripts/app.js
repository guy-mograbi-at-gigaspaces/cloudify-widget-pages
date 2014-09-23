'use strict';

angular.module('ibmBiginsightsUiApp', ['ngRoute','gsUiInfraApp']) // 'gsUiInfraApp'
    .config(function ($routeProvider) {
        $routeProvider
            .when('/order', {
                templateUrl: 'views/order.html',
                controller: 'OrderCtrl'
            })
            .when('/blu', {
                templateUrl: 'views/blu.html',
                controller: 'BluCtrl'
            })
            .when('/blusolo', {
                templateUrl : 'views/blu_solo.html',
                controller: 'BluSoloCtrl'
            })

            .when('/wrapper/bluSolo', {
                templateUrl : 'views/wrappers/bluSolo.html'
            })

            .when('/snippet/bluSolo', {
                templateUrl : 'views/snippets/bluSolo.html',
                controller: 'BluSoloCtrl'
            })

            .otherwise({
                controller: 'MainCtrl',
                templateUrl: 'views/main.html'
            });
    });
