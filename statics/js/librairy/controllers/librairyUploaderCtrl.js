'use strict';

/* controller */

var librairyControllers = angular.module('librairyControllers');

librairyControllers.controller('librairyUploaderCtrl', ['$scope', 'phUploader',
        function($scope, phUploader) {
            // publish uploader service in scope
            $scope.files = phUploader.files;
            $scope.handleFiles = phUploader.handleFiles;
            $scope.delFile = phUploader.delFile;
}]);

