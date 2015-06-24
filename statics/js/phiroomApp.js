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
        'phPortfolio',
        'phLightbox'
]);

// instantiate modules 
var phCore = angular.module('phCore', []);
var phUser = angular.module('phUser', []);
var phLibrairy = angular.module('phLibrairy', []);
var phWeblog = angular.module('phWeblog', ['ngSanitize']);
var phContact = angular.module('phContact', []);
var phPortfolio = angular.module('phPortfolio', []);
var phLightbox = angular.module('phLightbox', []);


phiroomApp.run(['$rootScope', '$state', '$stateParams', 'phUser',
        function ($rootScope, $state, $stateParams, phUser) {
    // store $state infos in rootScope for earyer retrieval
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // try to authenticate user without credentials (token from previous browser sessions)
    phUser.authenticate();

    // check if login is required on state changement
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var loginRequired = toState.data.loginRequired || false;
        if (loginRequired && ! phUser.isAuthenticated()) {
            event.preventDefault();
            // open login modal
            phUser.login().then(function() {
                console.log('go to ' + toState.name);
                $state.go(toState.name, toParams);
            }).catch(function() {
                if ($state.current.data && ! $state.current.data.loginRequired) {        
                    return $state.go($state.current);
                }
                else {
                    console.log('redirect to safe page 1');
                    return $state.go('weblog.list');
                }
            });
        }
    });
}]);


phiroomApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    
    // authentication interceptor
    $httpProvider.interceptors.push(function ($timeout, $q, $injector) {
        var phUser, $http, $state;

        $timeout(function () {
            phUser = $injector.get('phUser');
            $http = $injector.get('$http');
            $state = $injector.get('$state');
        });
        return {
            responseError: function (rejection) {
                // if not 401 status, do nothing
                if (rejection.status !== 401) {
                    return $q.reject(rejection);
                }
                var deferred = $q.defer();

                phUser.login().then(function() {
                    deferred.resolve($http(rejection.config));
                }).catch(function() {
                    $state.go('weblog.list');
                    deferred.reject(rejection);
                });
                return deferred.promise;
            }
        };
    });


    // html5 mode (no hash '#' in urls
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

    // rooter config
    //$urlRouterProvider.otherwise("/librairy/");
    $stateProvider.
        state('weblog', {
            templateUrl: '/assets/partials/weblog/weblog_base.html',
            controller: 'weblogCtrl',
            abstract: true,
            sticky: true,
            data: {
                loginRequired: false
            },
            resolve: {
                settings: function(phSettings) {
                    return phSettings.getSettings();
                }
            }
        }).
        state('weblog.list', {
            url: '/weblog/',
            templateUrl: '/assets/partials/weblog/weblog_list.html',
            controller: 'weblogListCtrl',
            resolve: {
                posts: function($stateParams, phPost, settings) {
                    return phPost.getPostsList($stateParams);
                }

            }
        }).
        state('weblog.list_paginate', {
            url: '/weblog/page/{page:int}/',
            templateUrl: '/assets/partials/weblog/weblog_list.html',
            controller: 'weblogListCtrl',
            resolve: {
                posts: function($stateParams, phPost, settings) {
                    return phPost.getPostsList($stateParams);
                }
            }
        }).
        state('weblog.tag_list', {
            url: '/weblog/tag/:tag/',
            templateUrl: '/assets/partials/weblog/weblog_list.html',
            controller: 'weblogListCtrl',
            resolve: {
                posts: function($stateParams, phPost, settings) {
                    return phPost.getPostsList($stateParams);
                }

            }
        }).
        state('weblog.tag_list_paginate', {
            url: '/weblog/tag/:tag/page/{page:int}/',
            templateUrl: '/assets/partials/weblog/weblog_list.html',
            controller: 'weblogListCtrl',
            resolve: {
                posts: function($stateParams, phPost, settings) {
                    return phPost.getPostsList($stateParams);
                }
            }
        }).
        state('weblog.detail', {
            // don't use {slug: [0-9]{4}/[0-9]{2}/[0-9]{2}/[-\w]}
            // because else '/' are url encoded
            url: '/weblog/{year:[0-9]{4}}/{month:[0-9]{2}}/{day:[0-9]{2}}/{slug}/',
            templateUrl: '/assets/partials/weblog/weblog_detail.html',
            controller: 'weblogDetailCtrl',
            resolve: {
                post: function($stateParams, phPost) {
                    return phPost.getPost($stateParams);
                }
            }
        }).
        state('weblog.detail.lb', {
            url: 'lightbox/{pk:int}/',
            templateUrl: '/assets/partials/lightbox/lightbox.html',
            controller: 'lightboxCtrl',
            resolve: {
                pictures: function(post) {
                    return post.data.pictures;
                }
            }
        }).
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

