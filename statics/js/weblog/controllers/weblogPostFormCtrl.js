'use strict';

/* controller */

var phWeblog = angular.module('phWeblog');

phWeblog.controller('weblogPostFormCtrl', ['$scope', 'phPost', 'phTag', 'phUtils',
        function($scope, phPost, phTag, phUtils) {
    // get flat tags list
    $scope.suggestions_list = [];
    phTag.getFlatTags().then(function(data) {
        // do a copy because we change the list
        angular.copy(phTag.flat_tags_list, $scope.suggestions_list);
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
        // create tag list if undefined
        if ($scope.current.tags == undefined) {
            $scope.current.tags = [];
        }
        // push tag if not already in list
        if (phUtils.indexOf($scope.current.tags, tag) == -1) {
            $scope.current.tags.push(tag);
            // remove tag from datalist if it's in
            var index = phUtils.indexOf($scope.suggestions_list, tag);
            if (index  != -1) {
                $scope.suggestions_list.splice(index, 1);
            }
        }
    };

    $scope.delTag = function(index) {
        // remove tag from list (splice returns an array)
        var tags = $scope.current.tags.splice(index, 1);
        // add back to datalist if it was removed from
        index = phUtils.indexOf(phTag.flat_tags_list, tags[0]);
        if (index != -1) {
            $scope.suggestions_list.push(phTag.flat_tags_list[index]);
        }
    };

}]);

