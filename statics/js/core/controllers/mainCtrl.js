'use strict';

/* controller */

var phiroomApp = angular.module('phiroomApp');

phiroomApp.controller('mainCtrl', ['$scope', 'phUser', 'phModal', 'phSettings',
        function($scope, phUser, phModal, phSettings) {

        $scope.modal = phModal;

        /* get settings */
        phSettings.getSettings().then(function() {
            $scope.settings = phSettings.settings;
        });

        /* get main menu */
        phSettings.getMenu().then(function() {
            $scope.main_menu = phSettings.menu;
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
