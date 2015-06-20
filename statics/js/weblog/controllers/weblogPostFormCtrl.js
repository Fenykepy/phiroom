'use strict';

/* controller */

var phWeblog = angular.module('phWeblog');

phWeblog.controller('weblogPostFormCtrl', ['$scope', 'phPost', 'phTag', 'phUtils',
        function($scope, phPost, phTag, phUtils) {
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

    $scope.addTag = function(tag) {
        if ($scope.current.tags == undefined) {
            // create tag list if undefined
            $scope.current.tags = [];
        }
        if (indexOf($scope.current.tags, tag) == -1) {
            // push tag if not already in list
            $scope.current.tags.push(tag);
        }
        console.log($scope);
    };

    $scope.cancel = function() {
        console.log('cancel');
    };

}]);

