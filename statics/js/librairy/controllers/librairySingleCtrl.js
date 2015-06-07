'use strict';

/* controller */

var phLibrairy = angular.module('phLibrairy');

phLibrairy.controller('librairySingleCtrl', ['$scope', '$stateParams', '$filter',
        function($scope, $stateParams, $filter) {
            // get requested picture
            $scope.pict = $filter('filter')($scope.picts, {pk: $stateParams.picture})[0];
}]);

