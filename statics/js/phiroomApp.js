'use strict';

/* App module */

var phiroomApp = angular.module('phiroomApp', [
        'ngAnimate',
        'ui.router',
        'commonServices',
        'librairyControllers',
        'librairyFilters',
        'librairyServices',
        'librairyDirectives',
        'librairyAnimations',
        'weblogControllers'
]);

// instantiate modules 
var commonServices = angular.module('commonServices', []);
var librairyControllers = angular.module('librairyControllers', []);
var librairyServices = angular.module('librairyServices', []);
var librairyDirectives = angular.module('librairyDirectives', []);
var librairyFilters = angular.module('librairyFilters', []);
var librairyAnimations = angular.module('librairyAnimations', []);
var weblogControllers = angular.module('weblogControllers', ['ngSanitize']);


phiroomApp.run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
}]);


phiroomApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        '$httpProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        // http configuration X-CSRF-Token
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

        // html5 mode (no hash '#' in urls
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        // rooter config
        //$urlRouterProvider.otherwise("/librairy/");
        $stateProvider.
            state('librairy', {
                url: '/librairy/',
                templateUrl: '/assets/partials/librairy/librairy_base.html',
                controller: 'librairyCtrl',
                sticky: true
            }).
            state('librairy.grid', {
                url: '{source:folder|collection|post|portfolio|tag}/{pk:[0-9]+|-}/',
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

