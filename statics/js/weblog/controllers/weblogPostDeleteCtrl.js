'use strict';

/* controller */

var phWeblog = angular.module('phWeblog');

phWeblog.controller('weblogPostDeleteCtrl', ['$scope', 'phPostDelete',
        function($scope, phPostDelete) {

    $scope.cancel = phPostDelete.reset;
    $scope.submit = phPostDelete.submit;
    $scope.errors = phPostDelete.errors;
    $scope.current = phPostDelete.post;
}]);

