'use strict';

/* services */

var phWeblog = angular.module('phWeblog');

/* :
 * getTags: returns a list of tags
 *
 */
phWeblog.factory('phTag', ['$http', '$filter',
        function($http, $filter) {
    var phTag = {};



    phTag.tags_list = [];


    // retrieve list of existing tags
    phTag.getTags = function() {
        // returns a promise with tags list
        return $http.get('/api/weblog/tags').success(function(data) {
            // store pictures list in service
            phTag.posts = data.results;
        });
    };
    

    return phTag;
}]);


