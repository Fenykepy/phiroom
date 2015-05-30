'use strict';
/* directives */

var librairyDirectives = angular.module('librairyDirectives');


librairyDirectives.directive('phDrag', ['$rootScope', function($rootScope) {
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
        scope: {
            dragData: '=',
        },
        link: function(scope, element, attrs)  {
            /* 
             * dragEffect can be :
             *  "move", "copy", "link", "copyMove",
             *  "copyLink", "linkMove", "all"
             *
             * phType: type of dragged data
             * dragData: value given to drop element
             * dragStyle: css style applyed to drag element during drag
             *
             */
            attrs.$set('draggable', 'true');
            scope.drag = {};
            scope.drag.type = attrs["phDrag"];
            scope.drag.data = scope.dragData.pk;
            scope.drag.style = attrs["dragStyle"];
            if (attrs["dragEffect"]) {
                scope.drag.effect = attrs["dragEffect"];
            } else {
                scope.drag.effect = "all";
            }
            element.bind('dragstart', function(evt) {
                /*
                 * we store dragged object in root scope
                 * because if we use dataTransfer.getData() we
                 * get only a serialized string.
                 */
                $rootScope.draggedElement = scope.dragData;
                dragStart(evt, element, scope.drag);
            });
            element.bind('dragend', function(evt) {
                dragEnd(evt, element, scope.drag.style);
            });
        }
    }
}]);


