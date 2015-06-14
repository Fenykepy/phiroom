'use strict';

/* controller */

var phWeblog = angular.module('phWeblog');


phWeblog.controller('weblogListCtrl', ['$scope', '$http',
        function($scope, $http) {
    var url = '/api/posts/?page_size=3';


    // request posts list
    $http.get(url).success(function(data) {
        $scope.posts = data.results;
        var id;
        if (data.next) {
            id = parseInt($routeParams.pageID) + 1;
            $scope.next = route + 'page/' + id + '/';
        }
        if (data.previous) {
            id = parseInt($routeParams.pageID) - 1;
            $scope.prev = route + 'page/' + id + '/';
        }
    });
}]);

