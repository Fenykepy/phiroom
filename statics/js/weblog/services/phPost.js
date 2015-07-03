'use strict';

/* services */

var phWeblog = angular.module('phWeblog');

phWeblog.factory('phPostConfig', ['phSettings', function(phSettings) {
    return {
        api_post_headers_url: '/api/weblog/post-head/',
        api_post_list_base_url: '/api/weblog/posts/',
        api_post_detail_base_url: '/api/weblog/posts/',
        frontend_post_list_base_url: '/weblog/',
        frontend_post_detail_base_url: '/weblog/',




        buildApiPostListUrl: function(params) {
            var url = this.api_post_list_base_url;
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
        },


        buildFrontendPostListUrl: function(params) {
            var url = this.frontend_post_list_base_url;
            if (params.tag) {
                url = url + 'tag/' + params.tag + '/'; 
            }
            if (params.page) {
                url = url + 'page/' + params.page + '/';
            }
            return url;
        },


        buildSlugFromParams: function(params) {
            // concatenate params to get slug
            return params.year + '/' +
                   params.month + '/' +
                   params.day + '/' +
                   params.slug;
        },


        buildApiPostDetailUrl: function(params) {
            return this.api_post_detail_base_url + 
                this.buildSlugFromParams(params) + '/';
        },


        buildFrontendPostDetailUrl: function(slug) {
            return this.frontend_post_detail_base_url + slug + '/';
        },


    };
}]);


phWeblog.factory('phPostHeaderList', ['$http', 'phPostConfig',
        function($http, phPostConfig) {
    var self = {
        posts_headers_list: [],
        getPostsHeadersList: function() {
            var url = phPostConfig.api_post_headers_url;
            return $http.get(url).success(function(data) {
                self.posts_headers_list = data;
            }).error(function(data) {
                console.warn('phPostHeaderList.getPostsHeadersList: error getting posts headers list:',
                        data); 
            });
        }
    };
    return self;
}]);


phWeblog.factory('phPostList', ['$http', '$location', '$stateParams', 'phPostConfig',
        function($http, $location, $stateParams, phPostConfig) {
    var self = {
        posts: [],
        next_page: null,
        prev_page: null,
        // retrieve paginated list of posts
        getPostsList: function(params) {
            var url = phPostConfig.buildApiPostListUrl(params);
            // reset next and previous pages
            self.next_page = null;
            self.prev_page = null;
            return $http.get(url).success(function(data) {
                self.posts = data.results;
                // store next and previous pages number
                var page = params.page || 1;
                if (data.next) {
                    self.next_page = page + 1;
                }
                if (data.previous) {
                    self.prev_page = page - 1;
                }
            }).error(function(data) {
                console.warn('phPostList.getPostsList: error getting posts list with params:',
                        params, data); 
            });
        },
        // go to given page with current route params
        goToPage: function(page) {
            var params = $stateParams;
            params.page = page;
            // do not use page param for page 1
            if (page == 1) {
                params.page = null;
            }
            var url = phPostConfig.buildFrontendPostListUrl(params);
            $location.path(url);
        }
    };

    return self;
}]);


phWeblog.factory('phPostDetail', ['$http', 'phPostConfig',
        function($http, phPostConfig) {
    var self = {
        post: {},
        // get post corresponding to current route params
        getPost: function(params) {
            var url = phPostConfig.buildApiPostDetailUrl(params);
            return $http.get(url).success(function(data) {
                self.post = data;
            }).error(function(data) {
                console.warn('phPostDetail.getPost: error getting post with params:',
                        params, data); 
            });
        }
    };

    return self;
}]);



phWeblog.factory('phPostCreate', ['$http', '$location', 'phModal', 'phPostConfig', 
        function($http, $location, phModal, phPostConfig) {
    var self = {
        // form errors
        errors: [],
        post: {},
        active: false, // for controller to know if we edit or create a new post
        reset: function() {
            /* close modal and reinit default properties */
            phModal.init();
            self.active = false;
            self.errors = [];
            self.post = {};
        },
        // open post creation modal window
        open: function() {
            self.active = true;
            phModal.init();
            phModal.templateUrl = "/assets/partials/weblog/weblog_post_form.html";
            phModal.title = "Write a new blog post";
            phModal.close_callback = self.reset;
            phModal.show = true;
        },
        // submit post creation form to server
        submit: function() {
            $http.post(phPostConfig.api_post_list_base_url, self.post).success(function(data) {
                self.reset();
                // go to newly created post
                $location.path(phPostConfig.buildFrontendPostDetailUrl(data.slug));
            }).error(function(data) {
                // show errors in modal
                self.errors = data;
            });
        }
    };

    return self;
}]);


phWeblog.factory('phPostEdit', ['$http', '$location', 'phModal', 'phPostConfig',
        function($http, $location, phModal, phPostConfig) {
    var self = {
        // form errors
        errors: [],
        post: {},
        active: false, // for controller to know if we edit or create a new post
        url: null,
        slug: null,
        reset: function() {
            /* close modal and reinit default properties */
            phModal.init();
            self.active = false;
            self.errors = [];
            self.post = {};
            self.url = null;
            self.slug = null;
        },
        // open post edition modal window
        open: function(post) {
            // init edited post object
            self.active = true;
            self.url = post.url;
            self.slug = post.slug;
            self.post.title = post.title;
            self.post.description = post.description;
            self.post.source = post.source;
            self.post.title = post.title;
            self.post.pub_date = new Date(post.pub_date);
            self.post.draft = post.draft;
            self.post.tags_flat_list = [];
            for (var i=0, l = post.tags.length; i < l; i++) {
                self.post.tags_flat_list.push(post.tags[i].name);
            }
            phModal.init();
            phModal.templateUrl = "/assets/partials/weblog/weblog_post_form.html";
            phModal.title = "Edit blog post";
            phModal.close_callback = self.reset;
            phModal.show = true;
        },
        // submit post edition form to server
        submit: function() {
            if (! self.post || ! self.url) {
                console.warn('phPostEdit: you must run open() before submit');
            }
            $http.put(self.url, self.post).success(function(data) {
                self.reset();
                if (data.slug == self.slug) {
                    // no change in url, reload post
                    angular.copy(data, phPost.post);
                } else {
                    // slug changed, go to new url
                    $location.path(phPostConfig.buildFrontendPostDetailUrl(data.slug));
                }
            }).error(function(data) {
                // show errors in modal
                self.errors = data;
            });
        }
    };

    return self;
}]);


phWeblog.factory('phPostDelete', ['$http', '$state', 'phModal', function($http, $state, phModal) {
    var self = {
        // form errors
        errors: [],
        post: {},
        url: null,
        reset: function() {
            /* close modal and reinit default properties */
            phModal.init();
            self.errors = [];
            self.post = {};
            self.url = null;
        },
        // open post deletion modal window
        open: function(post, url) {
            self.post = post;
            // get url as parameter because phPostEdit delete url from post.
            self.url = url;
            phModal.init();
            phModal.templateUrl = "/assets/partials/weblog/weblog_post_delete.html";
            phModal.title = "Delete a blog post";
            phModal.close_callback = self.reset;
            phModal.show = true;
        },
        // submit post deletion to server
        submit: function() {
            console.log(self.post)
            if (! self.post || ! self.url) {
                console.warn('phPostDelete: you must run open() before submit');
                return;
            }
            $http.delete(self.url).success(function(data) {
                self.reset();
                // go to weblog home
                $state.go('weblog.list');
            }).error(function(data) {
                // show errors in modal
                self.errors = data;
            });
        }
    };

    return self;
}]);
