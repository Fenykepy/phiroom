'use strict';

/* services */

var librairyServices = angular.module('librairyServices');

/* defines a rate service :
 *
 * element -> element object to be patch, must have a 'url' key
 * data -> object with data to patch, must correspond to element key value
 *
 */
librairyServices.factory('phPatcher', ['$http',
        function($http) {

    return function (element, data) {
        $http.patch(element.url, data)
            .success(function() {
                // update element
                for (var k in data) {
                    if (data.hasOwnProperty(k)) {
                        element[k] = data[k];
                    }
                }
        });
    }
}]);


