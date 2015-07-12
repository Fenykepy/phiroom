'use strict';

/* controller */

var phWeblog = angular.module('phWeblog');


phWeblog.controller('weblogCtrl', ['$scope',
        function($scope) {

    /* set page infos */
    $scope.page_info.title = 'Weblog';
    $scope.page_info.name = 'weblog';
}]);

