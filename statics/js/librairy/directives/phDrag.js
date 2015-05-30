'use strict';
/* directives */

var librairyDirectives = angular.module('librairyDirectives');


librairyDirectives.directive('phDrag', [function() {
    function dragStart(evt, element, drag) {
        element.addClass(drag.style);
        evt.originalEvent.dataTransfer.setData(drag.type, drag.data);
        evt.originalEvent.dataTransfer.effectAllowed = drag.effect;
        if (drag.type == "librairy/pict") {
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
             * phDragEffect can be :
             *  "move", "copy", "link", "copyMove",
             *  "copyLink", "linkMove", "all"
             *  default: "all"
             *
             * phDrag: type of dragged data
             * phDragData: value given to drop element (object pk for example)
             * phDragStyle: css style applyed to drag element during drag
             *
             */
            attrs.$set('draggable', 'true');
            scope.drag = {};
            scope.drag.type = attrs["phDrag"];
            scope.drag.data = attrs["phDragData"];
            scope.drag.style = attrs["phDragStyle"];
            if (attrs["phDragEffect"]) {
                scope.drag.effect = attrs["phDragEffect"];
            } else {
                scope.drag.effect = "all";
            }
            element.bind('dragstart', function(evt) {
                dragStart(evt, element, scope.drag);
            });
            element.bind('dragend', function(evt) {
                dragEnd(evt, element, scope.drag.style);
            });
        }
    }
}]);


