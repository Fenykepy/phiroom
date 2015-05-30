'use strict';
/* directives */

var librairyDirectives = angular.module('librairyDirectives');




librairyDirectives.directive('phDrop', ['$rootScope',
        function($rootScope) {

    function contains(list, value) {
        for (var i = 0; i < list.length; ++i) {
            if(list[i] === value) return true;
        }
        return false;
    };
    function containsFromList(list, value_list) {
        /* returns true if one of value_list item is in list */
        for (var i = 0; i < list.length; ++i) {
            if (contains(list, value_list[i])) return i;
        }
        return false;
    };
    function dragEnter(evt, element, drop) {
        drop.drop_allowed = false;
        var goodType = containsFromList(evt.originalEvent.dataTransfer.types,
                drop.accepted_types);
        /* use === false else 0 index is considered as false too */
        if (goodType === false) {
            // cancel drop if dragged element type isn't accepted
            return;
        }
        var drag_type = drop.accepted_types[goodType];
        
        /*
         * can't check if object is dragged on itself here because
         * dataTransfert.getData() is not available in dragEnter event
         * for security reason it's only available in onDrop event
         *
         */
        drop.drop_allowed = true;
        drop.drag_type = drag_type;
        evt.preventDefault();
        element.addClass(drop.style);
    };
    function dragLeave(evt, element, dropStyle) {
        element.removeClass(dropStyle);
    };
    function dragOver(evt, drop) {
        if (drop.drop_allowed) {
            evt.preventDefault();
        }
    };
    function drop(evt, element, dropStyle) {
        element.removeClass(dropStyle);
        evt.preventDefault();
    };

    return {
        restrict: 'A',
        link: function(scope, element, attrs)  {
            /*
             * phDrop: drop element type
             * phDropData: data to identifie drop element (pk for example
             * phDropStyle: class added to drop element when drop is valid
             * phDropAccept: white space separated list of accepted dragged type
             * phDropEffect: value for drop effect, can be : "copy", "move", "link"
             *          default : copy
             */
            scope.drop = {};
            scope.drop.type = attrs["phDrop"];
            scope.drop.data = attrs["phDropData"];
            scope.drop.style = attrs["phDropStyle"];
            scope.drop.accepted_types = attrs["phDropAccept"].split(" ");
            if (attrs["phDropEffect"]) {
                scope.drop.effect = attrs["phDropEffect"];
            } else {
                scope.drop.effect = "copy";
            }
            element.bind('dragenter', function(evt) {
                dragEnter(evt, element, scope.drop);
            });
            element.bind('dragleave', function(evt) {
                dragLeave(evt, element, scope.drop.style);
            });
            element.bind('dragover', function(evt) {
                dragOver(evt, scope.drop);
            });
            element.bind('drop', function(evt) {
                drop(evt, element, scope.drop.style);
                var basket = {
                    type: scope.drop.type,
                    data: scope.drop.data
                };
                var dropped = {
                    type: scope.drop.drag_type,
                    data: evt.originalEvent.dataTransfer.getData(scope.drop.drag_type)
                };
                if (basket.type == dropped.type && basket.data == dropped.data) {
                    // emit dropEvent only if object isn't dragged on itself
                    return
                }
                $rootScope.$broadcast('dropEvent', basket, dropped);
            });
        }
    }
}]);

