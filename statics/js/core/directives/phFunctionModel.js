'use strict';

/* directives */

var phCore = angular.module('phCore');

/*
 * execute function with content of input
 * at each enter or tab key press.
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
            element.bind("keydown keypress", function (event) {
                var TAB_KEY = 9;
                var ENTER_KEY = 13;
                if((event.which === TAB_KEY || event.which == ENTER_KEY)
                        && element[0].value) {
                    scope.$apply(callback(element[0].value));
                    element[0].focus();
                    element[0].value = '';
                    event.preventDefault();
                }
            });
        }
    };
}]);

