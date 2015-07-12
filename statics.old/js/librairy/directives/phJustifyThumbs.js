'use strict';

/* directives */

var phLibrairy = angular.module('phLibrairy');


phLibrairy.directive('phJustifyThumbs', ['$timeout', '$window', '$rootScope',
        function($timeout, $window, $rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            function justifyThumbs() {
                // max picture side
                var max_pict_side = 300;
                // Compute inner width (without scrollbar if any)
                var div = $('<div></div>'); // creating test div
                element.append(div); // append test div in section
                var inner_width = div.width(); // Compute width of test div
                div.remove(); // remove test div
                // Definition of the min number of picture per line
                var min_picture = Math.ceil((inner_width - 3) / (max_pict_side + 27));
                // Definition of the width of thumb-container
                var thumb_container_width = Math.floor((inner_width -
                            (min_picture * 3 + 3)) / min_picture);
                element.find('article.thumb div.thumb-container')
                    .css('width', thumb_container_width)
                    .css('height', thumb_container_width)
                    .css('line-height', thumb_container_width + 'px');
                // Definition of the picture size
                var size_picture = thumb_container_width - 24;
                element.find('img.thumbnail').css('max-width', size_picture)
                    .css('max-height', size_picture);
            };
            // justify when angular dom is ready
            $timeout(justifyThumbs, 0);
            // justify when left panel move
            scope.$watch(function() { return scope.hide_left_panel;}, function() {
                // use timeout else sometimes justify doesn't occur
                // 10 seems to be a good value.
                $timeout(justifyThumbs, 10);
            });
            // justify when state change (back from single view)
            $rootScope.$on('$stateChangeSuccess', function() {
                $timeout(justifyThumbs, 0);
            });
            // bind resize event to window
            angular.element($window).bind("resize", function (event) {
                justifyThumbs();
            });
        }
    };
}]);
