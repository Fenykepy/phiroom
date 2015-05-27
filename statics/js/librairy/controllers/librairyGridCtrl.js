'use strict';

/* controller */

var librairyControllers = angular.module('librairyControllers');

librairyControllers.controller('librairyGridCtrl', ['$scope', '$http', '$stateParams',
        function($scope, $http, $stateParams) {
            var url;
            if ($stateParams.source == 'folder') {
                url = '/api/librairy/directorys/'  + $stateParams.pk + '/pictures/';
            }
            /* get folder pictures */
            $http.get(url).
                success(function(data) {
                    $scope.picts = data;
            });
}]);
