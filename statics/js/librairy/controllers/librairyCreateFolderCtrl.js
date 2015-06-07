'use strict';

/* controller */

var phLibrairy = angular.module('phLibrairy');

phLibrairy.controller('librairyCreateFolderCtrl', ['$scope', 'phFolder',
        function($scope, phFolder) {
            // publish folder service in scope
            $scope.phFolder = phFolder;
}]);

