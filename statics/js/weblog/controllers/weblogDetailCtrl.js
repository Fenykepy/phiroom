'use strict';

/* controller */

var phWeblog = angular.module('phWeblog');


phWeblog.controller('weblogDetailCtrl', ['$scope', '$stateParams', '$filter',
        function($scope, $stateParams, $filter) {
    var slug = $stateParams.year + '/' + $stateParams.month + '/' + 
        $stateParams.day + '/' + $stateParams.slug;
    $scope.post = $filter('filter')($scope.posts, {slug: slug})[0];
    var index = $scope.posts.indexOf($scope.post);
    console.log(index);
    if (index > 0) {
        $scope.next = $scope.posts[index - 1];
    }
    if (index < $scope.posts.length - 1) {
        $scope.prev = $scope.posts[index + 1];
    }
}]);
