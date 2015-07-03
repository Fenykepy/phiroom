'use strict';

/* controller */

var phLibrairy = angular.module('phLibrairy');

phLibrairy.controller('librairyGridCtrl', ['$scope', 'phPicture', 'phRate',
        function($scope, phPicture, phRate) {
    $scope.type = phPicture.container_type; // folder|collection|post|portfolio|tag
    if ($scope.type == 'folder') {
        $scope.type = 'server';
    }
    $scope.picts = phPicture.picts;
    $scope.show_filter_bar = true;
    $scope.setRate = phRate;
    // show / hide menu array
    $scope.show_menu = [];
    for (var i=0, l=$scope.picts.length; i < l; i++) {
        // all menu are hidden by default
        $scope.show_menu.push(false);
    }
    $scope.rmPict = function(pict, index) {
        // close contextual
        $scope.show_menu[index] = false;
        // remove picture
        phPicture.del(pict, index);
    };
}]);


