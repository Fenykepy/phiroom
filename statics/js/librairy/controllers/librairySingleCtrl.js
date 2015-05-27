'use strict';

/* controller */

var librairyControllers = angular.module('librairyControllers');

librairyControllers.controller('librairySingleCtrl', ['$scope', '$http', '$stateParams', '$filter',
        function($scope, $http, $stateParams, $filter) {
            console.log($scope);
            console.log($scope.picts);
            // hide librairy template
            $scope.single = true;
            // get requested picture
            $scope.pict = $filter('filter')($scope.picts, {pk: $stateParams.picture})[0];
}]);

