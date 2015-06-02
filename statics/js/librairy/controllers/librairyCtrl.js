'use strict';

/* controller */

var librairyControllers = angular.module('librairyControllers');

librairyControllers.controller('librairyCtrl', ['$scope', '$rootScope', 'phFolder', 'phPatcher',
        'phListPictures', 'phUtils',
        function($scope, $rootScope, phFolder, phPatcher, phListPictures, phUtils) {
    /* set page infos */
    $scope.page_info.title = 'Librairy';
    $scope.page_info.name = 'librairy';
    
    
    /* get folders hierarchy */
    $scope.directorys = phFolder.directorys;
    phFolder.getDirectorys();

    $scope.mkdir = phFolder.mkdir;

    /* create a false root directory 
     * (to have an object for drag & drop
     */
    $scope.rootDir = phFolder.rootDir;


    /* get collections hierarchy */


    /* get portfolios list */

    
    /* get posts list */

    
    /* get tags list */
    
            
    /* listen drag & drop events */
    $rootScope.$on('dropEvent', function(evt, basket, dropped) {
        //console.log('drop ' + dropped.type + ' ' + dropped.data.pk + ' in ' + basket.type + ' ' + basket.data.pk);
        function dropPicture(basket, pict) {
            /* if element is a folder, and is not picture's one: */
            if (basket.type == "librairy/folder" && basket.data.pk != pict.directory) {
                // update picture folder
                var data = {
                    directory: basket.data.pk
                }
                var promise = phPatcher(pict, data);
                // if we are in folder list
                if (phListPictures.listType == 'folder') {
                    /* if basket folder is not a child of active one */
                    if (phFolder.isChild(basket.data.pk, phListPictures.pk) === false) {
                        /* then picture shouldn't be in list anymore, delete it */
                        // get index of picture object in list
                        var index = phUtils.getObjectIndexByKey(phListPictures.picts, 'pk', pict.pk);
                        // delete object from array
                        phListPictures.picts.splice(index, 1);
                    }
                }
            }

            /* if element is collection, copy picture to collection */
            /* if element is post, add element to post */
            /* if element is portfolio, add element to portfolio */
        }
        function dropFolder(basket, folder) {
            /* folder can only be dropped in another folder*/
            if (basket.type != "librairy/folder") throw 'Drag & drop error with folder';
            /* change folder parent */
            /* save server side */
            var data = {
                parent: basket.data.pk
            }
            var promise = phPatcher(folder, data);
            /* reload folders hierarchy
             * (for left panel tab, more easy than to update hierarchy)
             */
            if (promise) {
                // promise is false if no patch occur
                promise.then(function() {
                    // reload directorys
                    phFolder.getDirectorys();
                });
            }
        }
        if (dropped.type == "librairy/pict") {
            dropPicture(basket, dropped.data);
        } else if (dropped.type == "librairy/folder") {
            dropFolder(basket, dropped.data);
        } else {
            /* not handled dropped object type */
            console.log('dropEvent: not supported dropped object: ' + dropped.type);
        }
    });



}]);
