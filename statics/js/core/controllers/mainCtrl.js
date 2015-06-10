'use strict';

/* controller */

var phiroomApp = angular.module('phiroomApp');

phiroomApp.controller('mainCtrl', ['$scope', 'phUser', 'phModal', '$http',
        function($scope, phUser, phModal, $http) {

        $scope.modal = phModal;
        
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
        
        /* publish phUser service in scope */
        $scope.phUser = phUser;
       
        /* check if user is authenticated at arrival */
        if (phUser.isAuthenticated()) {
            /* load current user data if so */
            phUser.getCurrentUser();
        }


        /* set current page data */
        $scope.page_info = {
            title: '',
            name: '',
        }
}]);
