'use strict';

/* controller */

var weblogControllers = angular.module('weblogControllers');


weblogControllers.controller('weblogListCtrl', ['$scope', '$http',
        '$routeParams', function($scope, $http, $routeParams) {
    var url = '/api/posts/?page_size=3';
    if ( ! $routeParams.pageID) {
        $routeParams.pageID = 1;
    }
    else {
        url = url + '&page=' + $routeParams.pageID;
    }
    // request posts list
    $http.get(url).success(function(data) {
        $scope.posts = data.results;
        var id;
        if (data.next) {
            id = parseInt($routeParams.pageID) + 1;
            $scope.next = 'page/' + id + '/';
        }
        if (data.previous) {
            id = parseInt($routeParams.pageID) - 1;
            $scope.prev = 'page/' + id + '/';
        }
    });
}]);

