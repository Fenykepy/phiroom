'use strict';

/* App module */

var phiroomApp = angular.module('phiroomApp', [
        'ui.router',
        'librairyControllers',
        'librairyFilters',
        'librairyServices',
        'weblogControllers'
]);

// instantiate modules 
var librairyControllers = angular.module('librairyControllers', []);
var librairyFilters = angular.module('librairyFilters', []);
var librairyServices = angular.module('librairyServices', []);
var weblogControllers = angular.module('weblogControllers', ['ngSanitize']);


phiroomApp.run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
}]);


phiroomApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
        $urlRouterProvider.otherwise("/librairy");
        $stateProvider.
            state('librairy', {
                url: '/librairy/',
                templateUrl: '/assets/partials/librairy/librairy_base.html',
                controller: 'librairyCtrl'
            }).
            state('librairy.grid', {
                url: '{source:folder|collection|post|portfolio|tag}/{pk:int}/',
                templateUrl: '/assets/partials/librairy/librairy_grid.html',
                controller: 'librairyGridCtrl'
            }).
            state('librairy.grid.single', {
                url: 'single/{picture:int}/',
                templateUrl: '/assets/partials/librairy/librairy_single.html',
                controller: 'librairySingleCtrl'
            });
}]);

