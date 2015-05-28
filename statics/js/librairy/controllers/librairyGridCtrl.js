'use strict';

/* controller */

var librairyControllers = angular.module('librairyControllers');

librairyControllers.controller('librairyGridCtrl', ['$scope', 'pictures', 'phRate',
        function($scope, pictures, phRate) {
            $scope.picts = pictures.data;
            $scope.show_filter_bar = true;
            $scope.setRate = phRate; 
}]);
