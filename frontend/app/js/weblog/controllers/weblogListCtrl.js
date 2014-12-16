'use strict';

/* controller */

var weblogControllers = angular.module('weblogControllers');


weblogControllers.controller('weblogListCtrl', ['$scope', '$http',
        function($scope, $http) {
            // request posts list
            $http.get('/api/posts/').success(function(data) {
                $scope.posts = data.results;
             });
}]);

