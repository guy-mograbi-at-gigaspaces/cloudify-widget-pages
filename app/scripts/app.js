'use strict';

angular.module('ibmBiginsightsUiApp', ['ngRoute', 'gsUiInfraApp'])
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
            .otherwise({
                templateUrl: 'views/main.html'
            });
    });
