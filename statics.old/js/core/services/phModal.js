'use strict';

/*
 * define a Modal service :
 *
 */

var phCore = angular.module('phCore');


phCore.factory('phModal', function () {
    
    /*
     * all values should be set before passing "show" to true
     * (while modal isn't displayed)
     */
    var default_values = {
        /* 
         * wherever or not window is visible
         * (change for true to display modal window)
         */
        show: false,
        /*
         * templateUrl to include
         * (optionnal but if not set, modal will be empty)
         */
        templateUrl: '',
        /*
         * window title 
         * (optionnal)
         */
        title: 'Modal',
        /*
         * if set to false, modal window won't be closable
         * without validation
         * (must be set to true by validation function, right
         * after passing "show" to false)
         */
        closable: true,
        /* 
         * if true modal will be displayed in "max" mode:
         * it takes all available screen place
         * (with small margins)
         */
        max_window: false,
        /*
         * if true modal will be displayed in "large" mode:
         * fix width of arround 900px
         * (normal mode is arround 700px width) 
         */
        large_window: false,
        /* 
         * if true modal will be displayed in "small" mode:
         * fix width of arround 500px
         * (normal mode is arround 700px width) 
         */
        small_window: false,
        /* 
         * function which is called when modal window is closed
         * without validation.
         * (optionnal, if set must be a function)
         * (useful to reset a form for example)
         */
        close_callback: false, // cancellation function (optionnal)
        /*
         * darken modal more than usually
         */
        dark: false,
        /*
         * make overlay totally black
         */
        opaque: false,
    };
    
    var phModal = {};

    
    // close modal window and restore default parameters
    phModal.init = function() {
        // first hide window
        this.show = false;
        // then restaure values to default
        for (var prop in default_values) {
            if (default_values.hasOwnProperty(prop)) {
                this[prop] = default_values[prop];
            }
        }
    };


    // run close callback (on close button click),
    phModal.close = function() {
        // if window is not closable (forced validation) return
        if (this.closable === false) {
            console.warn('Modal is not closable');
            return;
        }
        // run cancellation function if set
        if (this.close_callback) {
            this.close_callback();
        }
        // close window
        this.init();
    }

    // set values to default
    phModal.init();

    return phModal;
});
