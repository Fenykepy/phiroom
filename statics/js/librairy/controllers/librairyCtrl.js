'use strict';

/* controller */

var librairyControllers = angular.module('librairyControllers');

librairyControllers.controller('librairyCtrl', ['$scope', '$rootScope', 'phFolder', 'phPatcher',
        function($scope, $rootScope, phFolder, phPatcher) {
    /* set page infos */
    $scope.$parent.page_info = {
        title: 'Librairy',
        name: 'librairy'
    }
    /* get folders hierarchy */
    $scope.directorys = phFolder.directorys;
    phFolder.getDirectorys();

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
        console.log('drop ' + dropped.type + ' ' + dropped.data.pk + ' in ' + basket.type + ' ' + basket.data.pk);
        function dropPicture(basket, pict) {
            /* if element is folder, update picture folder */

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
            phPatcher(folder, data);
            /* reload folders hierarchy
             * (for left panel tab, more easy than to update hierarchy)
             */
            phFolder.getDirectorys();
            //console.log(phFolder.directorys);
            console.log('in scope');
            console.log($scope.directorys);

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
