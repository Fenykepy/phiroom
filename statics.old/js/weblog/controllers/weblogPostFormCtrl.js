'use strict';

/* controller */

var phWeblog = angular.module('phWeblog');

phWeblog.controller('weblogPostFormCtrl', ['$scope', 'phPostCreate', 'phPostEdit', 'phPostDelete', 'phTag', 'phUtils',
        function($scope, phPostCreate, phPostEdit,
            phPostDelete, phTag, phUtils) {
    // get flat tags list
    $scope.suggestions_list = [];
    phTag.getFlatTags().then(function(data) {
        // do a copy because we change the list
        angular.copy(phTag.flat_tags_list, $scope.suggestions_list);
    });

    // for new post
    if (phPostCreate.active) {
        $scope.submit = phPostCreate.submit;
        $scope.cancel = phPostCreate.reset;
        $scope.current = phPostCreate.post;
        $scope.errors = phPostCreate.errors;
    }
    // to edit post
    else if (phPostEdit.active) {
        $scope.submit = phPostEdit.submit;
        $scope.cancel = phPostEdit.reset;
        $scope.current = phPostEdit.post;
        $scope.errors = phPostEdit.errors;
        $scope.url = phPostEdit.url;
        $scope.delete = phPostDelete.open;

    }

    $scope.addTag = function(tag) {
        // create tag list if undefined
        if ($scope.current.tags_flat_list == undefined) {
            $scope.current.tags_flat_list = [];
        }
        // push tag if not already in list
        if (phUtils.indexOf($scope.current.tags_flat_list, tag) == -1) {
            $scope.current.tags_flat_list.push(tag);
            // remove tag from datalist if it's in
            var index = phUtils.indexOf($scope.suggestions_list, tag);
            if (index  != -1) {
                $scope.suggestions_list.splice(index, 1);
            }
        }
    };

    $scope.delTag = function(index) {
        // remove tag from list (splice returns an array)
        var tags = $scope.current.tags_flat_list.splice(index, 1);
        // add back to datalist if it was removed from
        index = phUtils.indexOf(phTag.flat_tags_list, tags[0]);
        if (index != -1) {
            $scope.suggestions_list.push(phTag.flat_tags_list[index]);
        }
    };

}]);

