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
librairyServices.factory('phListPictures', ['$http', function($http) {
    // set url from parameters
    function set_url(params) {
        if (params.source == "folder") {
            var url = '/api/librairy/directorys/'
                + params.pk + '/pictures/';
        }
        return url
    }
    function get_list(params) {
        // returns a promise with pictures list
        return $http.get(set_url(params))
    }

    return {
       get: get_list
    }
}]);


