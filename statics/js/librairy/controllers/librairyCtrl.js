'use strict';

/* controller */

var phLibrairy = angular.module('phLibrairy');

phLibrairy.controller('librairyCtrl', ['$scope', '$rootScope', 'phFolder', 'phUploader', 'phPatcher',
        'phListPictures', 'phUtils', 'phPostHeaderList', 'phPostDetail',
        function($scope, $rootScope, phFolder, phUploader, phPatcher, phListPictures, phUtils, 
            phPostHeaderList, phPostDetail) {
    /* set page infos */
    $scope.page_info.title = 'Librairy';
    $scope.page_info.name = 'librairy';

    /* set panels visibility */
    $scope.hide_left_panel = false;
    
    
    /* get folders service */
    $scope.phFolder = phFolder;

    /* load directorys hierarchy */
    phFolder.getDirectorys();

    /* get posts */
    phPostHeaderList.getPostsHeadersList().then(function(data) {
        $scope.posts_headers = phPostHeaderList.posts_headers_list;
    });

    /* publish phUploader */
    $scope.phUploader = phUploader;

    /* get collections hierarchy */


    /* get portfolios list */

    
    /* get posts list */

    
    /* get tags list */
    
            
    /* listen drag & drop events */
    $rootScope.$on('dropEvent', function(evt, basket, dropped) {
        //console.log('drop ' + dropped.type + ' ' + dropped.data.pk + ' in ' + basket.type + ' ' + basket.data.pk);
        //console.log(basket);
        function dropPicture(basket, pict) {
            //console.log(basket);
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
            /* if element is post, add element to post */
            if (basket.type == "librairy/post") {
                phPostDetail.addPict(pict.pk, basket.data.pk)
            }

            /* if element is collection, copy picture to collection */
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
