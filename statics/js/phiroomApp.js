'use strict';

/* App module */

var phiroomApp = angular.module('phiroomApp', [
        'ngAnimate',
        'ui.router',
        'phCore',
        'phUser',
        'phLibrairy',
        'phWeblog',
        'phContact',
        'phPortfolio'
]);

// instantiate modules 
var phCore = angular.module('phCore', []);
var phUser = angular.module('phUser', []);
var phLibrairy = angular.module('phLibrairy', []);
var phWeblog = angular.module('phWeblog', []);
var phContact = angular.module('phContact', []);
var phPortfolio = angular.module('phPortfolio', []);


phiroomApp.run(['$rootScope', '$state', '$stateParams', 'phUser',
        function ($rootScope, $state, $stateParams, phUser) {
    // store $state infos in rootScope for earyer retrieval
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // check if login is required on state changement
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var loginRequired = toState.data.loginRequired;
        if (loginRequired && ! phUser.isAuthenticated()) {
            event.preventDefault();
            // open login modal
            phUser.login();

            // on success
            return //$state.go(toState.name, toParams);
            
            // on close stay in actual state if not login required
            // else redirect to home page
        }
    });
}]);


phiroomApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    
    // authentication interceptor
    $httpProvider.interceptors.push(function ($timeout, $q, $injector) {
        var phUser, $http, $state, $stateParams;
        return {
            responseError: function (rejection) {
                // if not 401 status, do nothing
                if (rejection.status !== 401) {
                    return rejection;
                }

                var deferred = $q.defer();
            }

                


        };
    });

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
            sticky: true,
            data: {
                loginRequired: true
            }
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

