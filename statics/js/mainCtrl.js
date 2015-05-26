'use strict';

/* controller */

var phiroomApp = angular.module('phiroomApp');

phiroomApp.controller('mainCtrl', ['$scope', '$http',
        function($scope, $http) {
        
        /* get conf object */
        $http.get('/api/settings/latest/').
            success(function(data) {
                $scope.conf = data;
        });

        /* get main menu list */
        $http.get('/api/settings/main-menu/').
            success(function(data) {
                $scope.main_menu = data.results;
        });
        /* get current user */
        $http.get('/api/users/current/').
            success(function(data) {
                $scope.user = data;
        });

        /* set current page data */
        $scope.page_info = {
            title: '',
            name: '',
        }

}]);
