'use strict';

/* services */

var phWebloge = angular.module('phWeblog');

/* :
 * get: returns a list of posts
 */
phWeblog.factory('phPost', ['$http', '$location', '$stateParams', 'phSettings',
        function($http, $location, $stateParams, phSettings) {
    var phPost = {};


    function build_api_list_url(params) {
        var url = '/api/weblog/posts/';
        var paginate_by = phSettings.settings.n_posts_per_page;
        var query = ['page_size=' + (paginate_by || 3)];
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
                url = url + join + query[i];
                join = '&';
            }
        }
        return url;
    };


    function build_frontend_list_url(params) {
        var url = '/weblog/';
        if (params.tag) {
            url = url + 'tag/' + params.tag + '/'; 
        }
        if (params.page) {
            url = url + 'page/' + params.page + '/';
        }
        return url;
    };

    function build_frontend_detail_url(params) {
        var url = buil_frontend_list_url(params);
        return url + params.slug + '/';
    };


    phPost.posts = [];

    phPost.getPostsList = function(params) {
        // returns a promise with posts list
        return $http.get(build_api_list_url(params)).success(function(data) {
            // store pictures list in service
            phPost.posts = data.results;
            // store next and prev pages number
            phPost.next_page = null;
            phPost.prev_page = null;
            var page = params.page || 1;
            if (data.next) {
                phPost.next_page = page + 1;
                phPost.next_page_API_url = data.next;
            }
            if (data.previous) {
                phPost.prev_page = page - 1;
                console.log(phPost.prev_page);
                phPost.prev_page_API_url = data.previous;
            }
        });
    };

    phPost.goToPage = function(page) {
        console.log('go to page:' + page);
        var params = $stateParams;
        params.page = page;
        if (page == 1) {
            // do not use page param for page 1
            params.page = null;
        }
        var url = build_frontend_list_url(params);
        console.log(url);
        $location.path(url);
    };

    return phPost;
}]);


