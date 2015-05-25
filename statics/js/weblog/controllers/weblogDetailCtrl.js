'use strict';

/* controller */

var weblogControllers = angular.module('weblogControllers');


weblogControllers.controller('weblogDetailCtrl', ['$scope', '$http',
     function($scope, $http) {
    /*$scope.postID = $routeParams.postID;
    $http.get('/api/posts/' + $routeParams.postID + '/').
        success(function(data) {
            $scope.post = data;
    });
    */
}]);
