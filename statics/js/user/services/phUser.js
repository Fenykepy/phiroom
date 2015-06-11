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


phUser.factory('phUser', ['$http', '$window', 'phModal', '$state',
        function($http, $window, phModal, $state) {
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
        // use string here, because it returns a string :/
        if (token == "undefined") {
            console.log('return');
            return;
        }
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
    };
    
    /* get current user datas */
    phUser.getCurrentUser = function() {
        $http.get(url).success(function(data) {
            phUser.user = data;
        });
    };

    /* check if user is authenticated */
    phUser.isAuthenticated = function() {
        var token = $window.localStorage.getItem('auth_token');
        // use string here, because it returns a string :/
        if (token != "undefined") {
            // read token here, and check it's expiration date
            var payload = parseJWT(token);
            var now = Date.now() / 1000;
            // * 1000 because argument is in milliseconds, not seconds
            var expire = payload.exp;
            var delta = expire - now;

            console.log('payload');
            console.log(payload);
            console.log('expire');
            console.log(expire);
            console.log('now');
            console.log(now);
            console.log('delta in sec');
            console.log(delta);
            // ask for refresh if about to expire
        }
        return token;
    };

    /* login user */
    phUser.login = function(callback) {
        /*
         * function to login a user
         * open a modal window with credentials form
         * on success close window and store auth token
         * callback: function executed on success
         */
        // modal validation function
        function validate() {
            // send credentials to server
            return $http.post(login_url, phUser.credentials)
                .success(function(response) {
                    console.log('success');
                    // store token on local storage
                    $window.localStorage.setItem('auth_token', response.token);
                    // configure $http to use token as authentication 
                    $http.defaults.headers.common['Authorization'] = 'JWT ' + response.token;
                    phModal.close();
                    // get user's datas
                    phUser.getCurrentUser();
                    console.log(phUser.isAuthenticated());
                    // execute callback
                    callback();
                }).error(function(data) {
                    phUser.errors = data;
                });
        };
        // modal close function
        function close() {
            // errors array and credentials
            phUser.errors = null;
            phUser.credentials = {};
        };
        // open modal Window
        phModal.templateUrl = '/assets/partials/user/user_login.html';
        phModal.title = "Sign in";
        phModal.validate_label = "Validate";
        phModal.validate_callback = validate;
        phModal.close_callback = close;
        phModal.show = true;
        phModal.small_window = true;
    };

    /* logout user */
    phUser.logout = function() {
        // delete auth token
        $window.localStorage.removeItem('auth_token');
        // delete user datas
        phUser.user = {};
        // delete $http auth header
        delete $http.defaults.headers.common['Authorization'];
        // redirect to login if not on safe state
        //$state.go('login');
        console.log('successfully logued user out');
        console.log(phUser.isAuthenticated());
    };

    /* register user */
    

    /* update user profile */
        


    return phUser;
}]);
