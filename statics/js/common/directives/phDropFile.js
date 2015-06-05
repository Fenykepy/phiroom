'use strict';
/* directives */

var commonDirectives = angular.module('commonDirectives');




commonDirectives.directive('phDropFile', ['$parse',
        function($parse) {

    function dragEnter(evt, element, style) {
        evt.preventDefault();
        evt.stopPropagation();
        element.addClass(style);
    };
    function dragLeave(evt, element, style) {
        element.removeClass(style);
    };
    function dragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    };
    function drop(evt, element, style) {
        element.removeClass(style);
            
        evt.preventDefault();
    };

    return {
        restrict: 'A',
        link: function(scope, element, attrs)  {
            /*
             * phDropFile must be function
             * it will be called with on parameter :
             * -> array containing dropped files
             *
             * phDropFileStyle : class name add to
             * element on dragenter and remove on dragleave.
             *
             */
            var model = $parse(attrs.phDropFile);
            var handleFiles = model(scope);
            var style = attrs["phDropFileStyle"];
            
            element.bind('dragenter', function(evt) {
                dragEnter(evt, element, style);
            });
            element.bind('dragleave', function(evt) {
                dragLeave(evt, element, style);
            });
            element.bind('dragover', function(evt) {
                dragOver(evt);
            });
            element.bind('drop', function(evt) {
                var dt = evt.originalEvent.dataTransfer;
                var files = dt.files;
                drop(evt, element, style);

                scope.$apply(handleFiles(files));
            });
        }
    }
}]);

