'use strict';

/* controller */

var phWeblog = angular.module('phWeblog');


phWeblog.controller('weblogListCtrl', ['$scope', 'phListPosts', 'posts',
        function($scope, phListPosts, posts) {
    $scope.posts = posts.data.results;
    $scope.next = phListPosts.next;
    $scope.prev = phListPosts.prev;
    console.log(posts)
}]);

