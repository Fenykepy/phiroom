'use strict';

/* directives */

var phLightbox = angular.module('phLightbox');

/*
 * position element as absolute,
 * and center it horizontally in it's
 * closest positioned parent
 *
 */

phCore.directive('phViewPortCenter', ['$window', '$parse', function ($window, $parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.phViewPortCenter);
            var pict = model(scope); 
            function adjust_position() {
                var margin_left = - (element.width() / 2)
                    console.log(margin_left);

                // postion element as absolute
                element.css({
                    'position': 'absolute',
                    'left': '50%',
                    'margin-left': margin_left + 'px'
                });
            };
            element.find('img').load(adjust_position).each(function() {
                // trigger load event if image is already loaded
                if (this.complete) {
                    $(this).trigger('load');
                }
            });
            // bind to change on pict url
            scope.$watch(function() {return model(scope) }, adjust_position);
            // bind resize event to window
            angular.element($window).bind("resize", function (event) {
                adjust_position();
            });
        }
    };
}]);

