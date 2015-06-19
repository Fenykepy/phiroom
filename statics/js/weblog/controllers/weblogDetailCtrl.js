'use strict';

/* controller */

var phWeblog = angular.module('phWeblog');


phWeblog.controller('weblogDetailCtrl', ['$scope', 'phPost', 'post',
        function($scope, phPost, post) {
    $scope.post = phPost.post;
    $scope.editPost = phPost.editPost;
}]);
