'use strict';

/* directives */

var librairyDirectives = angular.module('librairyDirectives');

librairyDirectives.directive('phUploaderFileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.phUploaderFileModel);
            var files_input = model(scope);
            element.bind('change', function(){
                scope.$apply(function(){
                    for (var i=0; i < element[0].files.length; i++) {
                        // add files to upload area if they aren't in already
                        console.log(files_input);
                        var isInArea = files_input.indexOf(element[0].files[i]);
                        if (isInArea == -1) {
                            files_input.push(element[0].files[i]);
                        }
                    }
                    // empty input
                    element[0].files = [];
                });
            });
        }
    };
}]);

