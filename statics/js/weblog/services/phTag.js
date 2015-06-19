'use strict';

/* services */

var phWeblog = angular.module('phWeblog');

/* :
 * getFlatTags: returns a flat list of tags
 *
 */
phWeblog.factory('phTag', ['$http', function($http) {
    var phTag = {};

    phTag.flat_tags_list = [];


    // retrieve list of existing tags
    phTag.getFlatTags = function() {
        // returns a promise with tags list
        return $http.get('/api/weblog/flat-tags/').success(function(data) {
            // store tags list in service
            phTag.flat_tags_list = data;
        });
    };
    

    return phTag;
}]);


