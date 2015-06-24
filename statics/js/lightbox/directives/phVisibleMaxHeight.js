'use strict';

/* directives */

var phLightbox = angular.module('phLightbox');

/*
 * set max height of element to visible part of browser window.
 * if a number (int) is passed as attribute, computed max-height will
 * be add to this number. It can be negative (to compensate some margin
 * or padding)
 *
 */

phCore.directive('phVisibleMaxHeight', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var delta = parseInt(attrs['phVisibleMaxHeight'], 10);
            function adjust_max_height() {
                var visible_height = angular.element($window).height() + delta;
                element.css('max-height', visible_height);
            };
            // set max height at init
            adjust_max_height();
            // bind resize event to window
            angular.element($window).bind("resize", function (event) {
                adjust_max_height();
            });
        }
    };
}]);

