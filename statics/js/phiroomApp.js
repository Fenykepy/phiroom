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
            state('librairy.list', {
                url: '{source:folder|collection|post|portfolio|tag}/{pk:int}/',
                templateUrl: '/assets/partials/librairy/librairy_list.html',
                controller: 'librairyListCtrl'
            }).
            state('librairy.list.detail', {
                url: '{picture:int}/',
                templateUrl: '/assets/partials/librairy/librairy_detail.html',
                controller: 'librairyDetailCtrl'
            });
}]);

