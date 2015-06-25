'use strict';

/* services */

var phLightbox = angular.module('phLightbox');




phLightbox.factory('phLightbox', ['phUtils', '$state', '$timeout', 'phPreloader', '$rootScope',
        function(phUtils, $state, $timeout, phPreloader, $rootScope) {
    var phLightbox = {};

    // store prev and next indexes
    var next_index = null;
    var prev_index = null;
    
    phLightbox.pictures = [];
    phLightbox.pk = null;

    function init() {
        next_index = null;
        prev_index = null;
        phLightbox.show = false;
        phLightbox.index = null;
        phLightbox.next_pict = null;
        phLightbox.prev_pict = null;
    };

    function get_index(pk) {
        return phUtils.getObjectIndexByKey(phLightbox.pictures,
                'pk', phLightbox.pk);
    };

    function get_pict(index) {
        return phLightbox.pictures[index]
    };

    function build_large_pict_url(picture) {
        // build large preview url
        return '/media/images/previews/large/' + picture.previews_path;
    };

    function load_next_pict() {
        next_index = phLightbox.index + 1 < phLightbox.pictures.length ?
            phLightbox.index + 1 : 0;
        phLightbox.next_pict = get_pict(next_index);
        // preload next pict
        var next_url = build_large_pict_url(phLightbox.next_pict);
        phLightbox.next_promise = phPreloader.load(next_url);
    };

    function load_prev_pict() {
        prev_index = phLightbox.index - 1 >= 0 ?
            phLightbox.index - 1 : phLightbox.pictures.length - 1;
        phLightbox.prev_pict = get_pict(prev_index);
        // preload prev pict
        var prev_url = build_large_pict_url(phLightbox.prev_pict);
        phLightbox.prev_promise = phPreloader.load(prev_url);
    };

    function go_to_pict(pict, index) {
        $state.go('.', {pk: phLightbox.prev_pict.pk}, {notify:false, reload:false});
        phLightbox.index = index;
        phLightbox.pict = pict;
        // get next and prev pictures to preload them
        load_next_pict();
        load_prev_pict();
    };
    

    /* go to next image */ 
    phLightbox.next = function() {
        go_to_pict(phLightbox.next_pict, next_index);
    };


    /* go to previous image */
    phLightbox.prev = function() {
        go_to_pict(phLightbox.prev_pict, prev_index);
    };

    /* open lightbox */
    phLightbox.open = function() {
        init();
        phLightbox.index = get_index();
        phLightbox.pict = get_pict(phLightbox.index);
        phLightbox.len = phLightbox.pictures.length;
        // block scroll on body
        $rootScope.lightbox_freeze = true;
        // add timeout to let time for animations
        $timeout(function() {
            phLightbox.show = true;
        }, 200);
        // get next and prev pictures to preload them
        if (phLightbox.len > 1) {
            load_next_pict();
            load_prev_pict();
        }
    };

    /* close lightbox */
    phLightbox.close = function () {
        phLightbox.show = false;
        // free scroll on body
        $rootScope.lightbox_freeze = false;
        // add timeout to let time for animations
        $timeout(function() {
            $state.go('^');
        }, 1000);
    };


    return phLightbox;
}]);
