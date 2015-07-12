'use strict';

/* controller */

var phLibrairy = angular.module('phLibrairy');

phLibrairy.controller('librairyPictureDeleteCtrl', ['$scope', 'phPictureDelete',
        function($scope, phPictureDelete) {

    $scope.pict = phPictureDelete.pict;
    $scope.cancel = phPictureDelete.reset;
    $scope.submit = phPictureDelete.submit;
}]);

