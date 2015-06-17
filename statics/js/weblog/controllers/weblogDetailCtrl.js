'use strict';

/* controller */

var phWeblog = angular.module('phWeblog');


phWeblog.controller('weblogDetailCtrl', ['$scope', 'phPost',
        function($scope, phPost) {
    $scope.post = phPost.post;
    $scope.next_post = phPost.next_post;
    $scope.prev_post = phPost.prev_post;
}]);
