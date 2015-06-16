'use strict';

/* controller */

var phLibrairy = angular.module('phLibrairy');

phLibrairy.controller('librairyUploaderCtrl', ['$scope', 'phUploader',
        function($scope, phUploader) {
            // publish uploader service in scope
            $scope.files = phUploader.files;
            $scope.handleFiles = phUploader.handleFiles;
            $scope.delFile = phUploader.delFile;
            $scope.close = phUploader.close;
            $scope.submit = phUploader.submit;
}]);

