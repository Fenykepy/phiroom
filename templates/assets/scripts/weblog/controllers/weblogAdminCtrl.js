'user strict';

/* controller */

var weblogControllers = angular.module('weblogControllers');

weblogControllers.controller('weblogAdminCtrl', ['$scope', '$http', 
        function($scope, $http) {
            // request actual post
            $http.get('/weblog/api/posts/6/').success(function(data) {
                $scope.post = data;
            });
            $scope.edit = false;
}]);
