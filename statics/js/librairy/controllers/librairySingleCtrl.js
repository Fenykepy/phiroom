'use strict';

/* controller */

var librairyControllers = angular.module('librairyControllers');

librairyControllers.controller('librairySingleCtrl', ['$scope', '$stateParams', '$filter',
        function($scope, $stateParams, $filter) {
            // get requested picture
            $scope.pict = $filter('filter')($scope.picts, {pk: $stateParams.picture})[0];
}]);

