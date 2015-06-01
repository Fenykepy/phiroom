'use strict';

/* define a Folder service :
 *
 * gets a hierarchical list of directorys,
 * store it
 * 
 * */

var librairyServices = angular.module('librairyServices');


librairyServices.factory('phFolder', ['$http', 'phUtils', function($http, phUtils) {
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
        $http.get(url).success(function(data) {
            angular.copy(data.results, phFolder.directorys);
        });
    };

    // create a fake root directory to be able to drag a folder to root
    phFolder.rootDir = {
        name: 'Root directory',
        pk: null
    };

    // function to know if given directory (pk) is children of second directory
    phFolder.isChild = function(dirPk, parentPk) {
        // search parent in directory list
        parent = phFolder.getDirectory(parentPk);
        // search child from parent in hierarchy
        return phFolder.getDirectory(dirPk, parent);
    };

    // returns position of given directory object from it's pk in directorys hierarchy, false if not found
    phFolder.getDirectory = function(dirpk, startdir) {
        if (! startdir) {
            startdir = phFolder.directorys;
        }
        console.log(startdir);

        function scanChildren(dir) {
            for (var i=0; i < dir.length; i++) {
                // if it's good object, return it
                if (phUtils.objectKeyEqual(dir[i], 'pk', Number(dirpk))) {
                    return dir[i];
                }
                // if object has children, recurse on them
                if (dir[i].children.length > 0) {
                    scanChildren(dir[i].children);
                }
            }
            // nothing found
            return false;
        };
        return scanChildren(startdir);
    };
    return phFolder;
}]);
