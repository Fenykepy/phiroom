'use strict';

/* App module */

var weblogApp = angular.module('weblogApp', [
        'ngRoute',
        'weblogControllers'
]);

// instantiate modules 
var weblogControllers = angular.module('weblogControllers', ['ngSanitize']);


weblogApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
        $routeProvider.
            when('/', {
                templateUrl: '/assets/partials/weblog/weblog_list.html',
                controller: 'weblogListCtrl'
            }).
            when('/page/:pageID/', {
                templateUrl: '/assets/partials/weblog/weblog_list.html',
                controller: 'weblogListCtrl'
            }).
            when('/:postID/', {
                templateUrl: '/assets/partials/weblog/weblog_detail.html',
                controller: 'weblogDetailCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });

}]);
