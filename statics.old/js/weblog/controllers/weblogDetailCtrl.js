'use strict';

/* controller */

var phWeblog = angular.module('phWeblog');


phWeblog.controller('weblogDetailCtrl', ['$scope', 'phPostDetail', 'phPostEdit', 'post',
        function($scope, phPostDetail, phPostEdit, post) {
    $scope.post = phPostDetail.post;
    $scope.editPost = phPostEdit.open;
}]);
