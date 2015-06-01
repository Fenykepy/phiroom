'use strict';

/* define a Folder service :
 *
 * gets a hierarchical list of directorys,
 * store it
 * 
 * */

var librairyServices = angular.module('librairyServices');


librairyServices.factory('phFolder', ['$http', function($http) {
    // hierarchical folder list url:
    var url = '/api/librairy/directorys/';
    var phFolder = {};
    // store directorys hierarchical list here
    phFolder.directorys = [];
    /* get directorys hierarchical list
     * and keep it sync like explained here:
     * http://www.justinobney.com/keeping-angular-service-list-data-in-sync-among-multiple-controllers/
     */
    phFolder.getDirectorys = function() {
        $http.get(url).success(function(data, status) {
            angular.copy(data.results, phFolder.directorys);
            console.log(status);
            console.log(data);
            console.log(phFolder.directorys);
        });
    };
    // create a fake root directory to be able to drag a folder to root
    phFolder.rootDir = {
        name: 'Root directory',
        pk: null
    }

    return phFolder;
}]);
