'use strict';

/* App module */

var weblogApp = angular.module('weblogApp', []);
weblogApp.controller('weblogListCtrl', function ($scope) {
    $scope.posts = [
        {'title': 'my first post'}
    ];
});
/*
var weblogApp = angular.module('weblogApp', [
        'weblogControllers',
]);

// instantiate modules 
var weblogControllers = angular.module('weblogControllers', []);
*/
