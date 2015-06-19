'use strict';

/* controller */

var phWeblog = angular.module('phWeblog');

phWeblog.controller('weblogPostFormCtrl', ['$scope', 'phPost', 'phTag', '$timeout',
        function($scope, phPost, phTag, $timeout) {
    // get flat tags list
    phTag.getFlatTags().then(function(data) {
        $scope.flat_tags_list = phTag.flat_tags_list;
    });
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

    $scope.cancel = function() {
        console.log('cancel');
    };

    $timeout(function() {
        console.log($scope.current.tags)
        }, 10000);
}]);

