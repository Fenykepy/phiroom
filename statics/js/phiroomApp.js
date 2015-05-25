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
        $stateProvider.
            state('librairy', {
                url: '/librairy',
                templateUrl: 'partials/librairy_base.html',
                controller: 'librairyCtrl'
            }).
            state('librairy.list', {
                url: '/:source/:pk',
                templateUrl: 'partials/librairy_list.html',
                controller: 'librairyListCtrl'
            }).
            state('librairy.list.detail', {
                url: '/:picture',
                templateUrl: 'partials/librairy_detail.html',
                controller: 'librairyDetailCtrl'
            })
}]);
