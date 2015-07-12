'use strict';

/* services */

var phLibrairy = angular.module('phLibrairy');

/* defines a path service :
 *
 * element -> element object to be patch, must have a 'url' key
 * data -> object with data to patch, must correspond to element key value
 * 
 * if corresponding keys in element and data have same value they won't be pathched
 * if some keys are in data and not in element, path will occur, but on success missing
 *      keys won't be add to element
 * if keys in data are corresponding to one key in elements and they have same value,
 *      patch won't occur (no need)
 *
 */
phLibrairy.factory('phPatcher', ['$http',
        function($http) {
    function is_different(element, data) {
        // delete elements that haven't change from data
        for (var k in data) {
            if (element[k] === data[k]) {
                delete data[k];
            }
        }
        // return false if no more key in data (so no patch necessary)
        return Object.keys(data).length
    }
    return function (element, data) {
        // check if patch is necessary
        var n_updates = is_different(element, data);
        // patch data if necessary and return promise
        if (n_updates) {
            return $http.patch(element.url, data)
                .success(function() {
                    // update element
                    var keys = Object.keys(data);
                    for (var i=0; i < keys.length; i++) {
                        var k = keys[i];
                        // check if element has key
                        if (element.hasOwnProperty(k)) {
                            element[k] = data[k];
                        }
                    }
            });
        }
        // return false if no patch was necessary
        return false;
    }
}]);


