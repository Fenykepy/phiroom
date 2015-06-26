'use strict';

/* controller */

var phWeblog = angular.module('phWeblog');


phWeblog.controller('weblogListCtrl', ['$scope', 'phPostList', 'phPostCreate', 'posts',
        function($scope, phPostList, phPostCreate, posts) {
    $scope.posts = phPostList.posts;
    $scope.next_page = phPostList.next_page;
    $scope.prev_page = phPostList.prev_page;
    $scope.goToPage = phPostList.goToPage;
    $scope.mkPost = phPostCreate.open;
}]);

