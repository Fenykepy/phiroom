'use strict';
/* directives */

var phLibrairy = angular.module('phLibrairy');


phLibrairy.directive('phDisplayOnDrag', ['$document', '$timeout', function($document, $timeout) {
    /*
     *
     * Display some elements on dragstart and hide them on dragend
     * elements are defined as by 'ph-order' jquery like selector
     * they will be search in children using 'find' method.
     *
     */

    return {
        restrict: 'A',
        link: function(scope, element, attrs)  {
            var selector = attrs["phDisplayOnDrag"];
            
            // show baskets when drag start
            $document.bind('dragstart', function(evt) {
                /*
                 * use $timeout here to prevent a bug in chrome when changing dom on drag event
                 */
                $timeout(function() {
                    element.find(selector).css('display', 'block')
                }, 0);
            });
            // hide baskets on leave
            $document.bind('dragend', function(evt) {
                // hide baskets on dragend
                element.find(selector).css('display', 'none');
            });
        }
    }
}]);



