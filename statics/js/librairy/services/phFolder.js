'use strict';

/* define a Folder service :
 *
 * gets a hierarchical list of directorys,
 * store it
 * 
 * */

var librairyServices = angular.module('librairyServices');


librairyServices.factory('phFolder', ['$http', 'phUtils', 'phModal', function($http, phUtils, phModal) {
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
        name: 'Root folder',
        pk: null
    };


    // create an empty object for new directorys
    phFolder.newDir = {
        name: '',
        parent: null
    };

    // function to know if given dir1 directory (pk) is children of dir2 directory (pk)
    phFolder.isChild = function(dirPk, dir2Pk) {
        // search parent in directory list
        parent = phFolder.getDirectory(dir2Pk);
        // search child from parent in hierarchy
        if (phFolder.getDirectory(dirPk, parent.children)) {
            return true;
        }
        return false;
    };

    // function to create a hierarchical of dirs for selects
    function dirsSelect() {
        var options = [{key: null, value: '--------'}];
        var base_prefix = "-- ";

        function scanDirList(dirs, prefix) {
            for (var i=0; i < dirs.length; i++) {
                options.push(
                    {key: dirs[i].pk, value: prefix + dirs[i].name}
                );
                // if directory has children, add them to options
                if (dirs[i].children.length > 0) {
                    scanDirList(dirs[i].children, prefix.trim() + base_prefix);
                }
            }
        }
        scanDirList(phFolder.directorys, '');
        console.log(options);

        return options;
    };


    // function to make a new directory
    phFolder.mkdir = function() {
        // store options (ng-options doesn't like function as options list)
        phFolder.dirsOptions = dirsSelect();
        function validate() {
            console.log('validate !');
            return true;
        };
        phModal.templateUrl = "/assets/partials/librairy/librairy_create_folder.html"
        phModal.title = "Create new folder";
        phModal.save_label = "Create";
        phModal.callback = validate;
        phModal.show = true;
    };

    // returns directory object from it's pk in directorys hierarchy, false if not found
    phFolder.getDirectory = function(dirPk, startdir) {
        if (! startdir) {
            // if no start point given, use whole directorys hierarchy
            startdir = phFolder.directorys;
        }
        
        var matched = false;
        function scanDir(dir) {
            for (var i=0; i < dir.length; i++) {
                // if it's good object, return it
                if (phUtils.objectKeyEqual(dir[i], 'pk', Number(dirPk))) {
                    matched = dir[i];
                    return;
                }
                // if object has children, scan them
                if (dir[i].children.length > 0) {
                    scanDir(dir[i].children);
                }
            }
        };
        // launch scan
        scanDir(startdir);

        return matched;
    };

    return phFolder;
}]);
