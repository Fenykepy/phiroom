'use strict';

/* controller */

var librairyControllers = angular.module('librairyControllers');

librairyControllers.controller('librairyCreateFolderCtrl', ['$scope', 'phFolder',
        function($scope, phFolder) {
            // publish new directory in scope
            $scope.new_dir = phFolder.newDir;
            $scope.dirsOptions = phFolder.dirsOptions;
}]);

