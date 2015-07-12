'use strict';
/* directives */

var phLibrairy = angular.module('phLibrairy');


phLibrairy.directive('phTrueOnDrag', ['$document', '$parse', 
        function($document, $parse) {
    /*
     *
     * Set phDisplayOnDrag variable to true on drag start event,
     * set it back to false on dragend.
     * useful to display items when drag start.
     *
     */

    return {
        restrict: 'A',
        scope: {
            phTrueOnDrag: '=',
        },
        link: function(scope, element, attrs)  {
            
            // set var to true drag start
            $document.bind('dragstart', function(evt) {
                scope.phTrueOnDrag = true;
                scope.$apply();
            });
            // set var to false on dragend
            $document.bind('dragend', function(evt) {
                scope.phTrueOnDrag = false;
                scope.$apply();
            });
        }
    }
}]);



