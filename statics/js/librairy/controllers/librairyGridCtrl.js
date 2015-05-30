'use strict';

/* controller */

var librairyControllers = angular.module('librairyControllers');

librairyControllers.controller('librairyGridCtrl', ['$scope', 'pictures',
        'phRate', 'phPatcher',
        function($scope, pictures, phRate, phPatcher) {
    $scope.picts = pictures.data;
    $scope.show_filter_bar = true;
    $scope.setRate = phRate;
}]);


