'use strict';

/* services */

var librairyServices = angular.module('librairyServices');

/* defines a rate service :
 *
 * element -> element object to be rate, must have a 'rate' key
 * pos -> int, button clicked 0 to 4
 * star -> boolean, true if button is star, false otherwise (point)
 * all -> boolean, true if all selected elements must be rated
 *
 */
librairyServices.factory('phRate', ['phSelection', 'phPatcher',
        function(phSelection, phPatcher) {

    function setRate(element, rate) {
        var data = {"rate":rate};
        phPatcher(element, data);
    }
    return function (element, pos, star, all) {
        // if no element given, return (when no element selected in grid mode
        if (! element) {
            return
        }
        var new_rate;
        if (element.rate > pos + 1 && star) {
            new_rate = pos + 1;
        }
        else if (element.rate < pos + 1 && ! star) {
            new_rate = pos + 1;
        }
        else {
            new_rate = pos;
        }
        if (! element.selected || ! all) {
            setRate(element, new_rate);
        }
        else {
            var selected = phSelection.getSelected();
            // rate all selected elements
            for (var i=0, len=selected.objects.length; i < len; i++) {
                setRate(selected.objects[i], new_rate);
            }
        }
    };
}]);


