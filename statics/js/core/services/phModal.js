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
         * if footer buttons are displayed
         * (in case modal shows some informations
         * which doen't need user validation)
         */
        buttons: true,
        /* validation button label*/
        validate_label: 'Save',
        /* cancellation button label */
        cancel_label: 'Cancel',
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
         * function which is called when validation button is clicked
         * (required, must be a function)
         * it should call phModal.close() itself, after some promise
         * resolution for example
         */
        validate_callback: false,
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
    phModal.close = function() {
        // if window is not closable (forced validation) return
        if (this.closable === false) {
            console.log('Modal is not closable');
            return;
        }
        // first hide window
        this.show = false;
        // run cancellation function if set
        if (this.close_callback) {
            this.close_callback();
        }
        // then restaure values to default
        for (var prop in default_values) {
            if (default_values.hasOwnProperty(prop)) {
                this[prop] = default_values[prop];
            }
        }
    };

    // run validation callback (on save button click),
    phModal.validate = function() {
        this.validate_callback();
        return;
    }

    // set values to default at init
    phModal.close();

    return phModal;
});
