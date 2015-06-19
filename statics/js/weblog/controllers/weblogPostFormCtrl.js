'use strict';

/* controller */

var phWeblog = angular.module('phWeblog');

phWeblog.controller('weblogPostFormCtrl', ['$scope', 'phPost',
        function($scope, phPost) {
    $scope.errors = phPost.errors;
    // for new post
    if (phPost.form_status == 'new') {
        $scope.postSubmit = phPost.mkPostSubmit;
        $scope.cancel = phPost.mkPostInit;
        $scope.current = phPost.newPost;
    }
    // to edit post
    else if (phPost.form_status == 'edit') {
        $scope.postSubmit = phPost.editPostSubmit;
        $scope.cancel = phPost.editPostInit;
        $scope.current = phPost.editedPost;
    }
}]);

