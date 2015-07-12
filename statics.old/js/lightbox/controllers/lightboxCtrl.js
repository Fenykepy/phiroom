'use strict';

/* controller */

var phLightbox = angular.module('phLightbox');

phLightbox.controller('lightboxCtrl', ['$scope', 'phLightbox', 'pictures', '$stateParams',
        function($scope, phLightbox, pictures, $stateParams) {
            phLightbox.pk = $stateParams.pk; 
            phLightbox.pictures = pictures;
            $scope.lb = phLightbox;
            $scope.lb.open();
}]);
