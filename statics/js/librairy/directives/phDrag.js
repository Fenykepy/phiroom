'use strict';
/* directives */

var librairyDirectives = angular.module('librairyDirectives');


librairyDirectives.directive('phDrag', ['$rootScope',
        function($rootScope) {
    function dragStart(evt, element, drag) {
        element.addClass(drag.style);
        evt.originalEvent.dataTransfer.setData(drag.type, drag.data);
        evt.originalEvent.dataTransfer.effectAllowed = drag.effect;
        if (drag.type == "pict") {
            var dragImage = document.getElementById("dragimage");
            dragImage.src = element[0].src;
            evt.originalEvent.dataTransfer.setDragImage(dragImage, 50, 50);
        }
    };
    function dragEnd(evt, element, dragStyle) {
        element.removeClass(dragStyle);
    };

    return {
        restrict: 'A',
        link: function(scope, element, attrs)  {
            /* 
             * drageffect can be :
             *  "move", "copy", "link", "copyMove",
             *  "copyLink", "linkMove", "all"
             *
             * dragtype: type of dragged data
             * dragdata: value given to drop element
             * dragstyle: css style applyed to drag element during drag
             *
             */
            attrs.$set('draggable', 'true');
            scope.drag = {};
            scope.drag.data = attrs["dragData"];
            scope.drag.type = attrs["phDrag"];
            scope.drag.style = attrs["dragStyle"];
            scope.drag.effect = attrs["dragEffect"];
            element.bind('dragstart', function(evt) {
                $rootScope.draggedElement = scope.drag;
                dragStart(evt, element, scope.drag);
            });
            element.bind('dragend', function(evt) {
                dragEnd(evt, element, scope.drag.style);
            });
        }
    }
}]);


