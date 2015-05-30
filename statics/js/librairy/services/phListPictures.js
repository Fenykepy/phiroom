'use strict';

/* services */

var librairyServices = angular.module('librairyServices');

/* :
 * get: returns a list of pictures from given directory
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


