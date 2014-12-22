'use strict';

/* App module */

var weblogApp = angular.module('weblogApp', [
        'ngRoute',
        'weblogControllers'
]);

// instantiate modules 
var weblogControllers = angular.module('weblogControllers', ['ngSanitize']);


weblogApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/assets/partials/weblog/weblog_list.html',
                controller: 'weblogListCtrl'
            }).
            when('/page/:pageID', {
                templateUrl: '/assets/partials/weblog/weblog_list.html',
                controller: 'weblogListCtrl'
            }).
            when('/:postID', {
                templateUrl: '/assets/partials/weblog/weblog_detail.html',
                controller: 'weblogDetailCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });

}]);
