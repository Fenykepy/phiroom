'use strict';

/* controller */

var weblogControllers = angular.module('weblogControllers');


weblogControllers.controller('weblogListCtrl', ['$scope', '$http',
        function($scope, $http) {
            // request posts list
            $scope.posts = [{'title': 'My first Post'}];
            $http.get('/api/posts/').then (function (result) {
                $scope.posts = result.data;
             });
}]);


