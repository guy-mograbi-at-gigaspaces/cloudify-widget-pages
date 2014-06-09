'use strict';

angular.module('ibmBiginsightsUiApp', [])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/order', {
                templateUrl: 'views/order.html',
                controller: 'OrderCtrl'
            })
            .otherwise({
                redirectTo: '/order'
            });
    });
