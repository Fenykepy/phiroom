'use strict';

/* controller */

var phUser = angular.module('phUser');

phUser.controller('userLoginCtrl', ['$scope', 'phUser',
        function($scope, phUser) {
            // publish user service in scope
            $scope.credentials = phUser.credentials;
            $scope.errors = phUser.errors;
}]);

