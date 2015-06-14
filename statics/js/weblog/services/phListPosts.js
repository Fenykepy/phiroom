'use strict';

/* services */

var phWebloge = angular.module('phWeblog');

/* :
 * get: returns a list of posts
 */
phWeblog.factory('phListPosts', ['$http', function($http) {
    var phListPosts = {};


    function build_api_url(params) {
        var url = '/api/weblog/posts/';
        var query = ['page_size=3']  // use phSetting.n_posts_per_page when ready !!!
        if (params.tag) {
            url = url + 'tag/' + params.tag + '/';
        }
        if (params.page) {
            query.push('page=' + params.page);
        }
        // if query strings add them to url
        if (query) {
            var join = '?';
            for (var i=0; i<query.length; i++) {
                url = url + join + query;
                join = '&';
            }
        }
        console.log(url);
        return url;
    };


    function build_frontend_url(params) {
        var url = '/weblog/';
        if (params.tag) {
            url = url + 'tag/' + params.tag + '/'; 
        }
        if (params.page) {
            url = url + 'page/' + params.page + '/';
        }
        return url;
    };


    phListPosts.posts = [];

    phListPosts.get = function(params) {
        // returns a promise with posts list
        return $http.get(build_api_url(params)).success(function(data) {
            // store pictures list in service
            phListPosts.posts = data.results;
            // store next and prev urls
            var page = params.page || 1;
            if (data.next) {
                params.page = page + 1;
                phListPosts.next = build_frontend_url(params);
            }
            if (data.prev) {
                params.page = page - 1;
                phListPosts.prev = build_frontend_url(params);
            }
        });
    };

    return phListPosts;
}]);


