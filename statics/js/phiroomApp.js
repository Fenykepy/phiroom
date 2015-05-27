'use strict';

/* App module */

var phiroomApp = angular.module('phiroomApp', [
        'ngAnimate',
        'ui.router',
        'librairyControllers',
        'librairyFilters',
        'librairyServices',
        'librairyAnimations',
        'weblogControllers'
]);

// instantiate modules 
var librairyControllers = angular.module('librairyControllers', []);
var librairyFilters = angular.module('librairyFilters', []);
var librairyServices = angular.module('librairyServices', []);
var librairyAnimations = angular.module('librairyAnimations', []);
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
                controller: 'librairyGridCtrl',
                resolve: {
                    pictures: function($stateParams, phListPictures) {
                        return phListPictures.get($stateParams);
                    }
                }
            }).
            state('librairy.grid.single', {
                url: 'single/{picture:int}/',
                templateUrl: '/assets/partials/librairy/librairy_single.html',
                controller: 'librairySingleCtrl'
            });
}]);

