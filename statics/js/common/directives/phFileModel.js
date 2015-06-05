'use strict';

/* directives */

var commonDirectives = angular.module('commonDirectives');

/*
 * file models must be attached to an input[type="file"] element
 * element can be multiple or not.
 * 
 * attach directive like this to the element
 * ph-file-model="handleFileFunction"
 *
 * handleFileFunction must be a function.
 * it will be called for each file added to the input element
 *
 */

commonDirectives.directive('phFileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.phFileModel);
            var handleFile = model(scope);
            element.bind('change', function() {
                for (var i=0; i < element[0].files.length; i++) {
                    handleFile(element[0].files[i]);
                }
            });
        }
    };
}]);

