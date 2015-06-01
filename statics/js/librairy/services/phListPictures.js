'use strict';

/* services */

var librairyServices = angular.module('librairyServices');

/* :
 * get: returns a list of pictures from given directory
 *
 */
librairyServices.factory('phListPictures', ['$http', function($http) {
    var phListPictures = {};
    // set url from parameters
    function set_url(params) {
        if (params.source == "folder") {
            var url = '/api/librairy/directorys/'
                + params.pk + '/pictures/';
        }
        return url
    }
    phListPictures.listType = '';
    phListPictures.pk = '';
    phListPictures.picts = [];
    phListPictures.get = function(params) {
        // store params (to know which list is displayed from other services
        phListPictures.listType = params.source;
        phListPictures.pk = params.pk;

        // returns a promise with pictures list
        return $http.get(set_url(params)).success(function(data) {
            // store pictures list in service
            phListPictures.picts = data;
        });
    };

    return phListPictures;
}]);


