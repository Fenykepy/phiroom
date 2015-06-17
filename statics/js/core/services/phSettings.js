'use strict';

/* services */

var phCore = angular.module('phCore');

/* 
 * getSettings: returns last settings
 * getMenu: returns last settings
 *
 */
phCore.factory('phSettings', ['$http', function($http) {
    var phSettings = {};
    var settings_url = '/api/settings/latest/';
    var menu_url = '/api/settings/main-menu/';

    phSettings.menu = [];
    phSettings.settings = {};
    
    phSettings.getSettings = function() {
        // returns a promise with settings
        return $http.get(settings_url).success(function(data) {
            // store settings in service
            phSettings.settings = data;
        });
    };
    phSettings.getMenu = function() {
        // returns a promise with menu
        return $http.get(menu_url).success(function(data) {
            // store menu in service
            phSettings.menu = data.results;
        });
    };

    return phSettings;
}]);


