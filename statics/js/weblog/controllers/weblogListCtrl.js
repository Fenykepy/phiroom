'use strict';

/* controller */

var weblogControllers = angular.module('weblogControllers');


weblogControllers.controller('weblogListCtrl', ['$scope', '$http',
        '$routeParams', function($scope, $http, $routeParams) {
    var url = '/api/posts/?page_size=3';
    var route = '';
    if ($routeParams.tagslug) {
        url = '/api/posts-by-tag/' + $routeParams.tagslug + '?page_size=3';
        route = 'tag/' + $routeParams.tagslug + '/';
    }
    if ( ! $routeParams.pageID) {
        $routeParams.pageID = 1;
    }
    else {
        url = url + '&page=' + $routeParams.pageID;
    }
    console.log(url);
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

