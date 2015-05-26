'use strict';

/* controller */

var librairyControllers = angular.module('librairyControllers');

librairyControllers.controller('librairyCtrl', ['$scope', '$http',
        function($scope, $http) {
            /* set page infos */
            $scope.$parent.page_info = {
                title: 'Librairy',
                name: 'librairy'
            }
            /* get folders hierarchy */
            $http.get('/api/librairy/directorys/').
                success(function(data) {
                    $scope.directorys = data.results;
            });


            /* get collections hierarchy */


            /* get portfolios list */

            
            /* get posts list */

            
            /* get tags list */


}]);
