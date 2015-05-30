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
        var goodType = containsFromList(evt.originalEvent.dataTransfer.types,
                drop.accepted_types);
        /* use === false else 0 index is considered as false too */
        if (goodType === false) {
            return;
        }
        drop.dragged_type = drop.accepted_types[goodType];
        evt.preventDefault();
        element.addClass(drop.style);
    };
    function dragLeave(evt, element, dropStyle) {
        element.removeClass(dropStyle);
    };
    function dragOver(evt, drop) {
        if ("dragged_type" in drop) {
            evt.preventDefault();
        }
    };
    function drop(evt, element, dropStyle) {
        evt.preventDefault();
        element.removeClass(dropStyle);
    };

    return {
        restrict: 'A',
        link: function(scope, element, attrs)  {
            /*
             * phDrop: drop element type
             * dropData: data to identifie drop element
             * dropStyle: class added to drop element when drop is valid
             * dropAccept: white space separated list of accepted dragged type
             * dropEffect: value for drop effect, can be : "copy", "move", "link"
             *          default : copy
             */
            scope.drop = {};
            scope.drop.type = attrs["phDrop"];
            scope.drop.data = attrs["dropData"];
            scope.drop.style = attrs["dropStyle"];
            scope.drop.accepted_types = attrs["dropAccept"].split(" ");
            if (attrs["dropEffect"]) {
                scope.drop.effect = attrs["dropEffect"];
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
                    type: scope.drop.dragged_type,
                    data: $rootScope.draggedElement
                };
                $rootScope.$broadcast('dropEvent', basket, dropped);
            });
        }
    }
}]);

