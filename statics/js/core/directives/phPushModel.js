'use strict';

/* directives */

var phCore = angular.module('phCore');

/*
 * push models must be attached to an input element
 * 
 * attach directive like this to the element
 * ph-push-model="destination_array"
 *
 * on enter press 
 *
 */

phCore.directive('phPushModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.phPushModel);
            var modelSetter = model.assign;
            var array = model(scope);
            // init scope with empty array in undefined
            if (array == undefined) {
                modelSetter(scope, []);
            }
            array = model(scope);
            element.bind('change', function() {
                scope.$apply(array.push(element[0].value));
                console.log(element[0].value);
                element[0].value = '';
                console.log(array);
            });
        }
    };
}]);

