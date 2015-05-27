'use strict';

/* filters */

var librairyFilters = angular.module('librairyFilters');

// returns 'Z/A' if input, else 'A/Z'
librairyFilters.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=0; i<total; i++) {
            input.push(i);
        }
        return input;
    };
});
