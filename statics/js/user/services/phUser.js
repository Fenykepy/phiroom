'use strict';

/* define a CurrentUser service :
 *
 * get logged in user data,
 *
 * login and logout users
 *
 * update user profil
 * update user password
 * 
 */

var phUser = angular.module('phUser');


phUser.factory('phUser', ['$http', '$window', 'phModal', '$state', '$q',
        function($http, $window, phModal, $state, $q) {
    var url = '/api/users/current/';
    var login_url = '/api/token-auth/';
    
    var phUser = {};
    phUser.user = {};

    /* credentials for login */
    phUser.credentials = {};
    /* forms errors */
    phUser.errors = [];

    /* read token */
    function parseJWT(token) {
        if (! token) {
            return;
        }
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
    };

    /* get token */
    function getToken() {
        var token = $window.localStorage.getItem('auth_token');
        // test string here, because it returns a string :/
        if (! token || token == "undefined") {
            return false;
        }
        
        return token;
    };

    /* set token */
    function setToken(token) {
        // store token on local storage
        $window.localStorage.setItem('auth_token', token);
        // store token reception date
        var now = Math.floor(Date.now() / 1000);
        $window.localStorage.setItem('auth_token_date', now);
        // authenticate
        phUser.authenticate()
    };

    /* refresh token */
    function refreshToken () {
        var url = '/api/token-refresh/';
        var actual_token = getToken();
        if (! actual_token) {
            console.log('no token available, impossible to refresh');
        }

        $http.post(url, {token: actual_token}).success(function(response) {
            setToken(response.token);
            console.log('successfully refreshed token');
        });
    };


    /* authenticate user */
    phUser.authenticate = function() {
        var token = getToken();
        if (token) {
            // configure $http to use token as authentication 
            $http.defaults.headers.common['Authorization'] = 'JWT ' + token;
        }
        else { return false }
    };

    
    /* get current user datas */
    phUser.getCurrentUser = function() {
        $http.get(url).success(function(data) {
            phUser.user = data;
        });
    };

    /* check if user is authenticated */
    phUser.isAuthenticated = function() {
        var token = getToken();
        if (! token) {
            return token;
        }
        // read token here, and check it's expiration date
        var payload = parseJWT(token);
        // actual timestamp (seconds)
        // / 1000 because argument is in milliseconds, not seconds
        var now = Math.floor(Date.now() / 1000);
        // expiration timestamp (seconds)
        var expire = payload.exp;
        var last_refresh = $window.localStorage.getItem('auth_token_date');
        // remaining time before token expiration
        var expire_delta = expire - now;
        
        // if token has expired
        if (expire_delta < 0) {
            phUser.logout();
            return false;
        }

        // passed time from last token refresh
        var refresh_delta = now - last_refresh;
        
        var max_token_age = 60 * 60 * 24; // 1 day
        
        // ask for refresh if about to expire
        if (refresh_delta > max_token_age) {
            refreshToken(token);
        }
        
        return token;
    };


    /* login user */
    // login promise
    var login_deferred = $q.defer();

    phUser.login = function() {
        /*
         * function to login a user
         * open a modal window with credentials form
         *
         */
        
        // modal cancel function
        function cancel() {
            // reject promise
            login_deferred.reject();
            //console.log('resolve promise');
            // errors array and credentials
            phUser.errors = null;
            phUser.credentials = {};
            /* if actual state needs authentication,
             * goto a safe page
             */
        };
        // open modal Window
        phModal.templateUrl = '/assets/partials/user/user_login.html';
        phModal.title = "Sign in";
        phModal.close_callback = cancel;
        phModal.show = true;
        phModal.small_window = true;

        // return promise
        return login_deferred.promise;
    };


    phUser.loginSubmit = function() {
        /*
         * function to submit user's credentials to server
         * on success: set token and user's data
         * on error: show errors in form
         */
        // send credentials to server
        $http.post(login_url, phUser.credentials)
            .success(function(response) {
                // store token on local storage
                setToken(response.token);
                // reinit modal
                phModal.init();
                // resolve promise with success
                login_deferred.resolve();
                // get user's data
                phUser.getCurrentUser();
                // reset errors
                phUser.errors = null;
            }).error(function(data) {
                phUser.errors = data;
            });
        // reset credentials
        phUser.credentials = {};
    };


    /* logout user */
    phUser.logout = function() {
        // delete auth token and it's date
        $window.localStorage.removeItem('auth_token');
        $window.localStorage.removeItem('auth_token_date');
        // delete user datas
        phUser.user = {};
        console.log(phUser.user);
        // delete $http auth header
        delete $http.defaults.headers.common['Authorization'];
        // redirect to login if not on safe state
        //$state.go('login');
        console.log('successfully logued user out');
        console.log(phUser.isAuthenticated());
        
        // reload state (so if authentication is needed,
        // it will ask for)
        /* !!! as there's a bug actually controllers are not reinitialise
         * so better go to a safe page, open login and redirect to old on
         * success.
         */
        $state.reload();
    };

    /* register user */
    

    /* update user profile */
        


    return phUser;
}]);
