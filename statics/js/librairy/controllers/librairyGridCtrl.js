'use strict';

/* controller */

var librairyControllers = angular.module('librairyControllers');

librairyControllers.controller('librairyGridCtrl', ['$scope', 'pictures',
        function($scope, pictures) {
            $scope.picts = pictures.data;
}]);
