'use strict';

/* define a CurrentUser service :
 *
 * get logged in user data,
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

    /* read token */
    function parseJWT(token) {
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
        if (token) {
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
    phUser.login = function() {
        var credentials = {username: 'flr',
                        password: 'foo'};
        // open modal Window
        // send credentials to server
        $http.post(login_url, credentials).success(function(response) {
            console.log('success');
            console.log(response);
            // store token on local storage
            $window.localStorage.setItem('auth_token', response.token);
            // configure $http to use token as authentication 
            $http.defaults.headers.common['Authorization'] = 'JWT ' + response.token;
            // get user's datas
            phUser.getCurrentUser();
            console.log(phUser.isAuthenticated());
        });
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
