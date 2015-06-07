'use strict';

/* directives */

var phCore = angular.module('phCore');

/*
 * file models must be attached to an input[type="file"] element
 * element can be multiple or not.
 * 
 * attach directive like this to the element
 * ph-file-model="handleFilesFunction"
 *
 * handleFilesFunction must be a function.
 * it will be called with array containing files added to input element.
 *
 */

phCore.directive('phFileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.phFileModel);
            var handleFiles = model(scope);
            element.bind('change', function() {
                scope.$apply(handleFiles(element[0].files));
            });
        }
    };
}]);

