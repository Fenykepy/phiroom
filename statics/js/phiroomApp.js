'use strict';

/* App module */

var phiroomApp = angular.module('phiroomApp', [
        'ui.router',
        'librairyControllers',
        'weblogControllers'
]);

// instantiate modules 
var librairyControllers = angular.module('librairyControllers', []);
var weblogControllers = angular.module('weblogControllers', ['ngSanitize']);


phiroomApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
        $urlRouterProvider.otherwise("/librairy");
        $stateProvider.
            state('librairy', {
                url: '/librairy',
                templateUrl: '/assets/partials/librairy/librairy_base.html',
                controller: 'librairyCtrl'
            }).
            state('librairy.list', {
                url: '/:source/:pk',
                templateUrl: '/assets/partials/librairy/librairy_list.html',
                controller: 'librairyListCtrl'
            }).
            state('librairy.list.detail', {
                url: '/:picture',
                templateUrl: '/assets/partials/librairy/librairy_detail.html',
                controller: 'librairyDetailCtrl'
            });
}]);
