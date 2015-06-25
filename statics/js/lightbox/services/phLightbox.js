'use strict';

/* services */

var phLightbox = angular.module('phLightbox');




phLightbox.factory('phLightbox', ['phUtils', '$state', '$timeout', 'phPreloader', '$rootScope',
        function(phUtils, $state, $timeout, phPreloader, $rootScope) {
    var self = {};

    // store prev and next indexes
    var next_index, prev_index;
    
    self.pictures = [];
    self.pk = null;

    function init() {
        next_index = null;
        prev_index = null;
        self.next_pict = {};
        self.prev_pict = {};
        self.show = false;
        self.stage = null;
        self.index = null;
        self.stage1 = {};
        self.stage2 = {};
    };

    function get_index(pk) {
        return phUtils.getObjectIndexByKey(self.pictures,
                'pk', pk);
    };

    function get_pict(index) {
        return self.pictures[index];
    };

    function build_large_pict_url(picture) {
        // build large preview url
        return '/media/images/previews/large/' + picture.previews_path;
    };

    function load_next_pict() {
        next_index = self.index + 1 < self.pictures.length ?
            self.index + 1 : 0;
        self.next_pict = get_pict(next_index);
        // preload next pict
        var next_url = build_large_pict_url(self.next_pict);
        var next_promise = phPreloader.load(next_url);
    };

    function load_prev_pict() {
        prev_index = self.index - 1 >= 0 ?
            self.index - 1 : self.pictures.length - 1;
        self.prev_pict = get_pict(prev_index);
        // preload prev pict
        var prev_url = build_large_pict_url(self.prev_pict);
        var prev_promise = phPreloader.load(prev_url);
    };

    function go_to_pict(pict, index) {
        $state.go('.', {pk: pict.pk}, {notify:false, reload:false});
        // if stage1 is active activate stage2
        if (self.stage) {
            self.stage2.pict = pict;
            self.stage2.index = index;
            self.stage = false;
        // if stage2 is active activate stage1
        } else {
            self.stage1.pict = pict;
            self.stage1.index = index;
            self.stage = true;
        }
        self.index = index;
        self.pict = pict;
        // get next and prev pictures to preload them
        load_next_pict();
        load_prev_pict();
    };
    

    /* go to next image */ 
    self.next = function() {
        go_to_pict(self.next_pict, next_index);
    };


    /* go to previous image */
    self.prev = function() {
        go_to_pict(self.prev_pict, prev_index);
    };

    /* open lightbox */
    self.open = function() {
        init();
        self.stage1.index = get_index(self.pk);
        self.stage1.pict = get_pict(self.stage1.index);
        // preload pict
        var url = build_large_pict_url(self.stage1.pict);
        var promise = phPreloader.load(url);
        self.len = self.pictures.length;
        // block scroll on body
        $rootScope.lightbox_freeze = true;
        // add timeout to let time for animations
        $timeout(function() {
            // open lightbox
            self.show = true;
            $timeout(function() {
                // switch to stage 1 
                self.stage = true;
            }, 1000);
        }, 200);
        // get next and prev pictures to preload them
        if (self.len > 1) {
            load_next_pict();
            load_prev_pict();
        }
    };

    /* close lightbox */
    self.close = function () {
        self.stage = null
        // add timeout to let time for animations
        $timeout(function() {
            self.show = false;
            $timeout(function() {
                $state.go('^');
            }, 1000);
        }, 1000);
        // free scroll on body
        $rootScope.lightbox_freeze = false;
    };


    return self;
}]);
