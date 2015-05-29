'use strict';

/* controller */

var librairyControllers = angular.module('librairyControllers');

librairyControllers.controller('librairyGridCtrl', ['$scope', '$rootScope', 'pictures',
        'phRate', 'phPatcher'
        function($scope, $rootScope, pictures, phRate, phPather) {
    $scope.picts = pictures.data;
    $scope.show_filter_bar = true;
    $scope.setRate = phRate;
    /* listen drag & drop events */
    $rootScope.$on('dropEvent', function(evt, basket, dropped) {
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
            var data;
            if (basket == '-') {
                /* set parent folder as null */
                data = {"parent": null};
            } else {
                var data = {"parent": basket.pk};
            }
            /* save server side */
            phPatcher(folder, data);
            /* reload folders hierarchy (for left panel tab) */
            


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


