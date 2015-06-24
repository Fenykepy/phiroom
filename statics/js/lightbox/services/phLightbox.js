'use strict';

/* services */

var phLightbox = angular.module('phLightbox');




phLightbox.factory('phLightbox', ['phUtils', '$state', function(phUtils, $state) {
    var phLightbox = {};

    function get_index(pk) {
        return phUtils.getObjectIndexByKey(phLightbox.pictures,
                'pk', phLightbox.pk);
    }

    function get_pict(index) {
        return phLightbox.pictures[index]
    };
    
    phLightbox.pictures = [];
    phLightbox.show = false;
    phLightbox.pk = null;

    /* go to next image */ 
    phLightbox.next = function() {
        var next_index = phLightbox.index + 1 < phLightbox.pictures.length ?
            phLightbox.index + 1 : 0;
        var next_pict = get_pict(next_index);
        $state.go('.', {pk: next_pict.pk});
    };


    /* go to previous image */
    phLightbox.prev = function() {
        var prev_index = phLightbox.index - 1 >= 0 ?
            phLightbox.index - 1 : phLightbox.pictures.length - 1;
        var prev_pict = get_pict(prev_index); 
        $state.go('.', {pk: prev_pict.pk});
    };

    /* open lightbox */
    phLightbox.open = function() {
        phLightbox.index = get_index();
        phLightbox.pict = get_pict(phLightbox.index);
        phLightbox.len = phLightbox.pictures.length;
        phLightbox.show = true;
    };

    /* close lightbox */
    phLightbox.close = function () {
        phLightbox.show = false;
        $state.go('^');
    };


    return phLightbox;
}]);
