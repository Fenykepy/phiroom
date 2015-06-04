'use strict';

/* directives */

var commonDirectives = angular.module('commonDirectives');

commonDirectives.directive('phFileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.phFileModel);
            var multiple = attrs.multiple;
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    if (multiple) {
                        modelSetter(scope, element[0].files);
                    } else {
                        modelSetter(scope, element[0].files[0]);
                    }
                });
            });
        }
    };
}]);

