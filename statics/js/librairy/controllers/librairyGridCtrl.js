'use strict';

/* controller */

var phLibrairy = angular.module('phLibrairy');

phLibrairy.controller('librairyGridCtrl', ['$scope', 'phListPictures', 'phRate',
        function($scope, phListPictures, phRate) {
    $scope.type = phListPictures.listType; // folder|collection|post|portfolio|tag
    $scope.picts = phListPictures.picts;
    $scope.show_filter_bar = true;
    $scope.setRate = phRate;
    // show / hide menu array
    $scope.show_menu = [];
    for (var i=0, l=$scope.picts.length; i < l; i++) {
        // all menu are hidden by default
        $scope.show_menu.push(false);
    }
    // if post, add remove from post in picture contextual menu
    if ($scope.type == 'post') {
        $scope.rmPictFrom = function(pict_pk, index) {
            // close contextual
            $scope.show_menu[index] = false;
            // remove picture
            phListPictures.picts.splice(index, 1);
        };
    }
    // if folder, add remove from serve in picture contextual menu
    if ($scope.type == 'folder') {
        $scope.type = 'server';
        $scope.rmPictFrom = function(pict_pk, index) {
            // close contextual
            $scope.show_menu[index] = false;
            // remove picture
            phListPictures.picts.splice(index, 1);
        };
    }
}]);


