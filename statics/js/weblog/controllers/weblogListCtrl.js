'use strict';

/* controller */

var phWeblog = angular.module('phWeblog');


phWeblog.controller('weblogListCtrl', ['$scope', 'phPost', 'posts',
        function($scope, phPost, posts) {
    $scope.posts = phPost.posts;
    $scope.next_page = phPost.next_page;
    $scope.prev_page = phPost.prev_page;
    $scope.goToPage = phPost.goToPage;
}]);

