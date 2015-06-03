'use strict';

/* controller */

var librairyControllers = angular.module('librairyControllers');

librairyControllers.controller('librairyCreateFolderCtrl', ['$scope', 'phFolder',
        function($scope, phFolder) {
            // publish folder service in scope
            $scope.phFolder = phFolder;
}]);

