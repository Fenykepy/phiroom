'use strict';

/* filters */

var phCore = angular.module('phCore');

/* returns input given array fullfill with total indexes
 *
 * exemple: []|phRange:5 returns [0,1,2,3,4]
 *
 * input: must be an array, empty or not
 * total: number of indexes to add to array
 */
phCore.filter('phRange', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=0; i<total; i++) {
            input.push(i);
        }
        return input;
    };
});
