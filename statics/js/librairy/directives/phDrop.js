'use strict';
/* directives */

var librairyDirectives = angular.module('librairyDirectives');




librairyDirectives.directive('phDrop', ['$rootScope',
        function($rootScope) {
    function dragEnter(evt, element, dropStyle) {
        evt.preventDefault();
        element.addClass(dropStyle);
    };
    function dragLeave(evt, element, dropStyle) {
        element.removeClass(dropStyle);
    };
    function dragOver(evt) {
        evt.preventDefault();
    };
    function drop(evt, element, dropStyle) {
        evt.preventDefault();
        element.removeClass(dropStyle);
    };

    return {
        restrict: 'A',
        link: function(scope, element, attrs)  {
            scope.dropData = attrs["phDrop"];
            scope.dropStyle = attrs["dropStyle"];
            element.bind('dragenter', function(evt) {
                dragEnter(evt, element, scope.dropStyle);
            });
            element.bind('dragleave', function(evt) {
                dragLeave(evt, element, scope.dropStyle);
            });
            element.bind('dragover', dragOver);
            element.bind('drop', function(evt) {
                drop(evt, element, scope.dropStyle);
                $rootScope.$broadcast('dropEvent', $rootScope.draggedElement, scope.dropData);
                console.log(scope.dropData);
                console.log($rootScope.draggedElement);
            });
        }
    }
}]);

