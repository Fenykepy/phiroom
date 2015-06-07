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


phUser.factory('phUser', ['$http', 'phModal', function($http, phModal) {
    var url = '/api/users/current/';
    
    var phUser = {};
    phUser.user = {};
    
    /* get current user datas */
    phUser.getCurrentUser = function() {
        $http.get(url).success(function(data) {
            phUser.user = data;
        });
    };

    return phUser;
}]);
