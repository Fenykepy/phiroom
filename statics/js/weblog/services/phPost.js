'use strict';

/* services */

var phWeblog = angular.module('phWeblog');

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
phWeblog.factory('phPost', ['$http', '$location', '$stateParams', 'phSettings', '$filter', 'phModal',
        function($http, $location, $stateParams, phSettings, $filter, phModal) {
    var phPost = {};


    function buildApiPostListUrl(params) {
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


    function buildFrontendPostListUrl(params) {
        var url = '/weblog/';
        if (params.tag) {
            url = url + 'tag/' + params.tag + '/'; 
        }
        if (params.page) {
            url = url + 'page/' + params.page + '/';
        }
        return url;
    };


    function buildSlugFromParams(params) {
        // concatenate params to get slug
        return params.year + '/' +
               params.month + '/' +
               params.day + '/' +
               params.slug;
    };


    function buildApiPostDetailUrl(params) {
        var url = '/api/weblog/posts/';
        return url + buildSlugFromParams(params) + '/';
    };


    function buildFrontendPostDetailUrl(slug) {
        return '/weblog/' + slug + '/';
    };


    phPost.posts = [];

    phPost.post = null;

    phPost.newPost = {};


    phPost.mkPost = function() {
        phPost.form_status = 'new';
        phModal.templateUrl = "/assets/partials/weblog/weblog_post_form.html";
        phModal.title = "Write a new blog post";
        phModal.close_callback = phPost.mkPostInit;
        phModal.show = true;
    };

    phPost.mkPostSubmit = function() {
        var new_post_url = '/api/weblog/posts/';
        $http.post(new_post_url, phPost.newPost)
            .success(function(data) {
                // reinit modal, errors and new post
                phPost.newPost = {};
                phPost.mkPostInit();
                // go to newly created post
                $location.path(buildFrontendPostDetailUrl(data.slug));
            }).error(function(data) {
                // show errors in form
                phPost.errors = data;
            });
    };

    phPost.mkPostInit = function() {
        // reinit modal
        phModal.init();
        // reinit errors
        phPost.errors = null;

    };


    phPost.editPost = function() {
        // if no actual post detail, return 
        console.log('edit post');
        if (! phPost.post) { return; }
        // init edited post object
        phPost.editedPost = {};
        phPost.editedPost.title = phPost.post.title;
        phPost.editedPost.description = phPost.post.description;
        phPost.editedPost.source = phPost.post.source;
        phPost.editedPost.title = phPost.post.title;
        phPost.editedPost.pub_date = new Date(phPost.post.pub_date);
        phPost.editedPost.draft = phPost.post.draft;
        // init controller
        phPost.form_status = 'edit';
        // init modal
        phModal.templateUrl = "/assets/partials/weblog/weblog_post_form.html";
        phModal.title = "Edit blog post";
        phModal.close_callback = phPost.editPostInit;
        phModal.show = true;
    };


    phPost.editPostSubmit = function() {
        var url = buildApiPostDetailUrl($stateParams);
        console.log(url);
        $http.put(url, phPost.editedPost)
            .success(function(data) {
                // reinit modal, errors and new post
                phPost.editedPost = {};
                phPost.editPostInit();
                if (data.slug == phPost.post.slug) {
                    console.log('get post');
                    // no change in url, reload post
                    angular.copy(data, phPost.post);
                } else {
                    console.log('location');
                    // slug changed, go to new url
                    $location.path(buildFrontendPostDetailUrl(data.slug));
                }
            }).error(function(data) {
                phPost.errors = data;
            });
    };

    phPost.editPostInit = function() {
        // reinit modal and errors
        phPost.mkPostInit();
    };


    // retrieve list of posts
    phPost.getPostsList = function(params) {
        // returns a promise with posts list
        return $http.get(buildApiPostListUrl(params)).success(function(data) {
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
    

    // retrieve a specific post
    phPost.getPost = function(params) {
        var slug = buildSlugFromParams(params);
        return $http.get(buildApiPostDetailUrl(params)).success(function(data) {
            phPost.post = data;
        });
    };


    // go to given post list page
    phPost.goToPage = function(page) {
        var params = $stateParams;
        params.page = page;
        if (page == 1) {
            // do not use page param for page 1
            params.page = null;
        }
        var url = buildFrontendPostListUrl(params);
        $location.path(url);
    };


    return phPost;
}]);


