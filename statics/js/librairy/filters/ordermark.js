'use strict';

/* filters */
var librairyFilters = angular.module('librairyFilters');


// returns 'Z/A' if input, else 'A/Z'
librairyFilters.filter('ordermark', function() {
    return function(input) {
        return input ? 'Z/A' : 'A/Z';
    };
});
