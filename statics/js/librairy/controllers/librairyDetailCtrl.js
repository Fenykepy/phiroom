'use strict';

/* controller */

var librairyControllers = angular.module('librairyControllers');

librairyControllers.controller('librairyDetailCtrl', ['$scope', '$http', '$stateParams', '$filter',
        function($scope, $http, $stateParams, $filter) {
            console.log($scope.$parent);
            console.log($scope.$parent.picts);
            console.log($scope.picts);
            $scope.pict = $filter('filter')($scope.picts, {pk: $stateParams.picture})[0];
}]);

