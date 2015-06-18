'use strict';

/* services */

var phWebloge = angular.module('phWeblog');

/* :
 * get: returns a list of posts
 * next_post = more recent post
 * next_page = next page number, so more old posts in list
 *
 * prev_post = more old post
 * prev_page = prev page number, so more recent posts in list
 *
 * next should be displayed right and prev left.
 *
 */
phWeblog.factory('phPost', ['$http', '$location', '$stateParams', 'phSettings', '$filter',
        function($http, $location, $stateParams, phSettings, $filter) {
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
        var url = build_frontend_list_url(params);
        return url + params.slug + '/';
    };

    function buildSlugFromParams(params) {
        // concatenate params to get slug
        return params.year + '/' +
               params.month + '/' +
               params.day + '/' +
               params.slug;
    };

    function postIndex() {
        // return index of actual detailed post in actual posts list.
        return phPost.posts.indexOf(phPost.post);
    };

    function postHasNext() {
        if (postIndex() > 0) {
            // next post is in current list
            return true;
        }
        if (phPost.prev_page) {
            // next post is on previous page
            return phPost.prev_page;
        }
        return false;
    };

    function postHasPrev() {
        if (postIndex() < phPost.posts.length - 1) {
            // previous post is in current list
            return true;
        }
        if (phPost.next_page) {
            // previous post in on next page
            return phPost.next_page;
        }
        return false
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
                phPost.prev_page_API_url = data.previous;
            }
        });
    };

    phPost.getPostFromList = function(params) {
        var slug = buildSlugFromParams(params);
        phPost.post = $filter('filter')(phPost.posts, {slug: slug})[0];
        phPost.next_post = postHasNext();
        phPost.prev_post = postHasPrev();
        return phPost.post;
    };

    phPost.goToPage = function(page) {
        var params = $stateParams;
        params.page = page;
        if (page == 1) {
            // do not use page param for page 1
            params.page = null;
        }
        var url = build_frontend_list_url(params);
        $location.path(url);
    };

    phPost.goToPost = function(slug) {
        var params = $stateParams;
        params.slug = slug;

        var url = build_frontend_detail_url(params);
        $location.path(url);
    };

    phPost.goToNextPost = function() {
        var has_next = postHasNext();
        // post is in current list if true
        if (has_next === true) {
            var index = postIndex() - 1;
            var slug = phPost.posts[index].slug;
            phPost.goToPost(slug);
        }
        // post in on another page if number
        else if (has_next) {
            var params = $stateParams;
            if (phPost.prev_page == 1) {
                params.page = null;
            }
            else {
                params.page = phPost.prev_page;
            }
            $http.get(phPost.prev_page_API_url)
                .success(function(data) {
                params.slug = data.results[data.results.length -1].slug;
                var url = build_frontend_detail_url(params);
                $location.path(url);
            });
        }
    };

    phPost.goToPrevPost = function() {
        var has_prev = postHasPrev();
        // post in in current list if true
        if (has_prev === true) {
            var index = postIndex() + 1;
            var slug = phPost.posts[index].slug;
            phPost.goToPost(slug);
        }
        // post in on another page if number
        else if (has_prev) {
            var params = $stateParams;
            if (phPost.next_page == 1) {
                params.page = null;
            }
            else {
                params.page = phPost.next_page;
            }
            $http.get(phPost.next_page_API_url)
                .success(function(data) {
                params.slug = data.results[0].slug;
                var url = build_frontend_detail_url(params);
                $location.path(url);
            });
        }

    };



    return phPost;
}]);


