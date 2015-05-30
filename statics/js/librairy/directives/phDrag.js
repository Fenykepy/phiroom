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
        if (drag.type == "librairy/folder") {
            var dragImage = element.closest('li')[0];
            evt.originalEvent.dataTransfer.setDragImage(dragImage, 120, 10);
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
            scope.drag.object = scope[attrs["phDragData"]];
            /* if dragged object has pk, use it for serialisation */
            if (scope.drag.object.hasOwnProperty('pk')) {
                scope.drag.data = scope.drag.object.pk;
            } else {
                scope.drag.data = scope.drag.object;
            }
            scope.drag.style = attrs["phDragStyle"];
            if (attrs["phDragEffect"]) {
                scope.drag.effect = attrs["phDragEffect"];
            } else {
                scope.drag.effect = "all";
            }
            element.bind('dragstart', function(evt) {
                /* store dragged object in root scope because
                 * data transfert allows only string type
                 */
                $rootScope.draggedObject = scope.drag.object;
                dragStart(evt, element, scope.drag);
            });
            element.bind('dragend', function(evt) {
                dragEnd(evt, element, scope.drag.style);
            });
        }
    }
}]);


