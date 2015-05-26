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


}]);
