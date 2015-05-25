'use strict';

/* App module */

var phiroomApp = angular.module('phiroomApp', [
        'ngRoute',
        'librairyControllers',
        'weblogControllers'
]);

// instantiate modules 
var librairyControllers = angular.module('librairyControllers', []);
var weblogControllers = angular.module('weblogControllers', ['ngSanitize']);


phiroomApp.config(['$routeProvider', '$locationProvider',
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
            when('/tag/:tagslug/', {
                templateUrl: '/assets/partials/weblog/weblog_list.html',
                controller: 'weblogListCtrl'
            }).
            when('/tag/:tagslug/page/:pageID/', {
                templateUrl: '/assets/partials/weblog/weblog_list.html',
                controller: 'weblogListCtrl'
            }).
            when('/:postID/', {
                templateUrl: '/assets/partials/weblog/weblog_detail.html',
                controller: 'weblogDetailCtrl'
            }).
            when('/librairy/', {
                templateUrl: '/assets/partials/librairy/librairy_base.html',
                controller: 'librairyListCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });

}]);
