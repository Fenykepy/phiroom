'use strict';

/* directives */

var phCore = angular.module('phCore');

/*
 * execute function with content of input
 * at each input change event, then clear input
 * and keep focus
 *
 * attach directive like this to the element
 * ph-function-model="my_function"
 *
 */

phCore.directive('phFunctionModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.phFunctionModel);
            var callback = model(scope);
            element.bind('change', function(e) {
                scope.$apply(callback(element[0].value));
                element[0].value = '';
            });
        }
    };
}]);

