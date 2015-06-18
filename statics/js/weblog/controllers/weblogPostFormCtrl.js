'use strict';

/* controller */

var phWeblog = angular.module('phWeblog');

phWeblog.controller('weblogPostFormCtrl', ['$scope', 'phPost',
        function($scope, phPost) {
            // publish post service in scope
            $scope.phPost = phPost;
}]);

